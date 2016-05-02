module NavHelper
  def demo_navbar
    nav_pages t('nav').values.flatten
  end

  def demo_index
    t('nav').map { |sect, titles| [sect.to_s.titleize, nav_pages(titles)] }
  end

  def nav_pages(titles)
    titles.map { |t| [t, t.parameterize] }
  end
end
