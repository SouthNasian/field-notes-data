import {PortableText} from '@portabletext/react'
import type {PortableTextBlock} from '@portabletext/types'
import imageUrlBuilder from '@sanity/image-url'
import {client} from '../lib/client'

const imageBuilder = imageUrlBuilder(client)

type ArticleImage = {
  _type: 'image'
  asset?: {_ref?: string; _type?: 'reference'}
  alt?: string
  caption?: string
}

const components = {
  types: {
    image: ({value}: {value: ArticleImage}) => {
      if (!value?.asset?._ref) return null

      const src = imageBuilder.image(value).width(1600).auto('format').url()

      return (
        <figure style={{margin: '2rem 0'}}>
          {/* Sanity's image CDN serves the correctly sized, optimized image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={value.alt || 'Article illustration'}
            loading="lazy"
            decoding="async"
            style={{display: 'block', width: '100%', height: 'auto', borderRadius: '8px'}}
          />
          {value.caption ? (
            <figcaption style={{marginTop: '0.65rem', fontSize: '0.9rem', lineHeight: 1.5, color: '#59665e'}}>
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      )
    },
  },
}

export function PortableArticle({value}: {value?: PortableTextBlock[]}) {
  if (!value?.length) return null
  return (
    <div className="sanity-article">
      <PortableText value={value} components={components} />
    </div>
  )
}
