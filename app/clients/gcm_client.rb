# encoding: binary
#
class GCMClient
  ONE_BUFFER = "1".b
  AUTH_INFO = "Content-Encoding: auth" + '\0'
  MAX_PAYLOAD_LENGTH = 4078;

  def initialize(gcm_api_key=nil)
    @gcm_api_key = gcm_api_key || ENV.fetch('GOOGLE_CLOUD_MESSAGE_API_KEY', nil)
  end

  def encrypt(message, subscription, padding_length = 0)
    padding = make_padding(padding_length)

    plaintext = padding + message

    validate_message(message, padding)
    validate_subscription(subscription)

    client_public_key = Base64.urlsafe_decode64(subscription.dig(:keys, :p256dh))
    client_auth_token = Base64.urlsafe_decode64(subscription.dig(:keys, :auth))

    validate_length(client_public_key, 65, "subscription public key")
    validate_length(client_auth_token, 16, "subscription auth token")

    salt = SecureRandom.random_bytes(16)

    server_ecdh = generate_key_ecdh
    client_public_key_point = to_key_point(client_public_key)
    shared_secret = server_ecdh.dh_compute_key(client_public_key_point)

    server_public_key = server_ecdh.public_key.to_bn.to_s(2)

    prk = hkdf(client_auth_token, shared_secret, AUTH_INFO, 32);

    context = create_context(client_public_key, server_public_key)

    content_encryption_key_info = create_info("aesgcm", context)

    content_encryption_key = hkdf(salt, prk, content_encryption_key_info, 16);

    nonce_info = create_info('nonce', context)
    nonce = hkdf(salt, prk, nonce_info, 12)

    cipher_text = encrypt_payload(plaintext, content_encryption_key, nonce)

    {
      cipher_text: cipher_text,
      salt: salt,
      server_public_key: server_public_key
    }
    # OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new("sha256"), secret_key, string)

    # padding = make_padding(padding_length)
    #
    # plaintext = padding <> message
    #
    # :ok = validate_subscription(subscription)
    #
    # client_public_key = Base.url_decode64!(subscription.keys.p256dh)
    # client_auth_token = Base.url_decode64!(subscription.keys.auth)
    #
    # :ok = validate_length(client_auth_token, 16, "Subscription's Auth token is not 16 bytes.")
    # :ok = validate_length(client_public_key, 65, "Subscription's client key (p256dh) is invalid.")
    #
    # salt = Crypto.rand_bytes(16)
    #
    # {server_public_key, server_private_key} = Crypto.generate_key(:ecdh, :prime256v1)
    #
    # shared_secret = :crypto.compute_key(:ecdh, client_public_key, server_private_key, :prime256v1)
    #
    # prk = hkdf(client_auth_token, shared_secret, @auth_info, 32)
    #
    # context = create_context(client_public_key, server_public_key)
    #
    # content_encryption_key_info = create_info("aesgcm", context)
    # content_encryption_key = hkdf(salt, prk, content_encryption_key_info, 16)
    #
    # nonce_info = create_info("nonce", context)
    # nonce = hkdf(salt, prk, nonce_info, 12)
    #
    # ciphertext = encrypt_payload(plaintext, content_encryption_key, nonce)
    # %{ciphertext: ciphertext, salt: salt, server_public_key: server_public_key}
  end

  def encrypt_payload(plaintext, content_encryption_key, nonce)
    cipher = OpenSSL::Cipher.new("aes-128-gcm")
    cipher.encrypt
    cipher.key = content_encryption_key
    cipher.iv = nonce
    cipher_text = cipher.update(plaintext)
    cipher.final
    cipher_text + cipher.auth_tag

    # {cipher_text, cipher_tag} = :crypto.block_encrypt(:aes_gcm, content_encryption_key, nonce, {"", plaintext})
    # cipher_text <> cipher_tag

    # const cipher = crypto.createCipheriv('id-aes128-GCM', contentEncryptionKey, nonce);
    # const result = cipher.update(plaintext);
    # cipher.final();
    #
    # return Buffer.concat([result, cipher.getAuthTag()]);
  end

  def create_info(type, context)
    "Content-Encoding: " +
      type +
      zeros(1) +
      "P-256" +
      context
  end

  def create_context(client_public_key, server_public_key)
    # The context format is:
    # 0x00 || length(clientPublicKey) || clientPublicKey ||
    #         length(serverPublicKey) || serverPublicKey
    # The lengths are 16-bit, Big Endian, unsigned integers so take 2 bytes each.

    # The keys should always be 65 bytes each. The format of the keys is
    # described in section 4.3.6 of the (sadly not freely linkable) ANSI X9.62
    # specification.
    if client_public_key.bytesize != 65
      raise "Invalid client public key length"
    end

    # This one should never happen, because it's our code that generates the key
    if server_public_key.bytesize != 65
      raise 'Invalid server public key length'
    end

    context = zeros(1) +
      client_public_key.bytesize.to_s +
      client_public_key +
      server_public_key.bytesize.to_s +
      server_public_key

    context.force_encoding("ASCII-8BIT")
  end

  # HMAC-based Extract-and-Expand Key Derivation Function (HKDF)
  #
  # This is used to derive a secure encryption key from a mostly-secure shared
  # secret.
  #
  # This is a partial implementation of HKDF tailored to our specific purposes.
  # In particular, for us the value of N will always be 1, and thus T always
  # equals HMAC-Hash(PRK, info | 0x01).
  #
  # @link https://www.rfc-editor.org/rfc/rfc5869.txt
  def hkdf(salt, initial_key_material, info, length)
    digest = OpenSSL::Digest.new("sha256")
    hmac = OpenSSL::HMAC.new(salt, digest)
    hmac << initial_key_material
    prk = hmac.digest

    infohmac = OpenSSL::HMAC.new(prk, digest)
    infohmac << AUTH_INFO
    infohmac << ONE_BUFFER
    infohmac.digest.byteslice(0, length)
  end

  def generate_key_ecdh
    ecdh = OpenSSL::PKey::EC.new("prime256v1")
    ecdh.generate_key
    ecdh
  end

  def to_key_point(public_key)
    ecdh = OpenSSL::PKey::EC.new("prime256v1")
    public_key_bn = OpenSSL::BN.new(public_key, 2)
    OpenSSL::PKey::EC::Point.new(ecdh.group, public_key_bn)
  end

  def validate_length(string, length, descrption)
    if string.nil?
      raise "#{description} was nil (Expected #{length.to_int})"
    end

    if string.bytesize != length.to_int
      raise "#{description} was #{string.bytesize} bytes (Expected #{length.to_int})"
    end
    true
  end

  def validate_message(message, padding)
    if (message.length + padding.length) > MAX_PAYLOAD_LENGTH
      raise "Payload is too large. The max number of bytes is #{MAX_PAYLOAD_LENGTH}, " +
        "input is #{message.length} bytes plus #{padding.length} bytes of padding."
    end
  end

  def validate_subscription(subscription)
    if !subscription.dig(:keys, :p256dh) || !subscription.dig(:keys, :auth)
      raise "Subscription is missing encryption details."
    end
  end

  # The padding value is a 16-bit big-endian integer specifying the padding length followed by that number of NUL bytes of padding.
  def make_padding(padding_length)
    binary_length = padding_length.to_s.b
    binary_length + zeros(padding_length)
    # binary_length = <<padding_length :: unsigned-big-integer-size(16)>>
    # binary_length <> :binary.copy(<<0>>, padding_length)
  end

  def zeros(n = 32)
    zeros = "\0" * n
    zeros.force_encoding("ASCII-8BIT")
  end
end
