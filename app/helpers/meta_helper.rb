module MetaHelper
  def metatag(attrs)
    "<meta #{attrs.map { |k,v| %Q|#{k}=\"#{v}\"| }.join(" ")}>"
  end

  def site_metatags
    Rails.cache.fetch('site_metatags') do
      site_metadata.map do |attrs|
        metatag(attrs)
      end.join("\n").html_safe
    end
  end

  def site_metadata
    [
      { name: "description", content: t('meta.description') },
      { name: "keywords", content: t('meta.keywords') },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:creator", content: t('meta.author') },
      { name: "twitter:description", content: t('meta.description') },
      { name: "twitter:image:src", content: image_path(t('meta.image')) },
      { name: "twitter:title", content: t('meta.title') },
      { property: "og:site_name", content: t('meta.site_name') },
      { property: "og:description", content: t('meta.description') },
      { property: "og:image", content: image_path(t('meta.image')) },
      { property: "og:title", content: t('meta.title') },
      { charset: "utf-8" },
      { "http-equiv" => 'X-UA-Compatible', content: 'IE: edge;chrome: 1' },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1"},
      { name: "mobile-web-app-capable", content: "yes" }
    ]
  end
end
