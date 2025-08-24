import { useEffect } from 'react'

/**
 * Custom hook to dynamically set meta tags with auto URL and image fallback
 * @param {Object} options
 * @param {string} options.title - Page title
 * @param {string} options.description - Page description
 * @param {string} options.keywords - Comma-separated keywords
 * @param {string} options.author - Page author
 * @param {string} [options.url] - Full page URL (auto uses current window.location)
 * @param {string} [options.image] - Image URL for OG/Twitter (auto uses default)
 */
const usePageMeta = ({ title, description, keywords, author, url, image }) => {
  useEffect(() => {
    const defaultImage = '/chart-bar.svg' // default fallback image
    const currentUrl = url || window.location.href

    if (title) document.title = title

    const setMeta = (selector, attr, content) => {
      let el = document.head.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        document.head.appendChild(el)
      }
      el.setAttribute(attr, content)
    }

    // Standard meta
    if (description) setMeta('meta[name="description"]', 'name', description)
    if (keywords) setMeta('meta[name="keywords"]', 'name', keywords)
    if (author) setMeta('meta[name="author"]', 'name', author)

    // Open Graph
    if (title) setMeta('meta[property="og:title"]', 'property', title)
    if (description) setMeta('meta[property="og:description"]', 'property', description)
    setMeta('meta[property="og:url"]', 'property', currentUrl)
    setMeta('meta[property="og:image"]', 'property', image || defaultImage)
    setMeta('meta[property="og:type"]', 'property', 'website')

    // Twitter Card
    setMeta('meta[name="twitter:card"]', 'name', 'summary_large_image')
    if (title) setMeta('meta[name="twitter:title"]', 'name', title)
    if (description) setMeta('meta[name="twitter:description"]', 'name', description)
    setMeta('meta[name="twitter:image"]', 'name', image || defaultImage)
  }, [title, description, keywords, author, url, image])
}

export default usePageMeta
