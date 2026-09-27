import {PortableText} from '@portabletext/react'
import type {PortableTextBlock} from '@portabletext/types'
export function PortableArticle({value}:{value?:PortableTextBlock[]}){if(!value?.length)return null;return <div className="sanity-article"><PortableText value={value}/></div>}
