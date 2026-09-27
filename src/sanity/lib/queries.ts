import {defineQuery} from 'next-sanity'

export const INQUIRIES_QUERY=defineQuery(`*[_type=="post"&&contentType=="inquiry"]|order(publishedAt desc){_id,title,subtitle,"slug":slug.current,publishedAt,logNumber,featured,heroImage,"categories":categories[]->title,tags}`)
export const INQUIRY_QUERY=defineQuery(`*[_type=="post"&&contentType=="inquiry"&&slug.current==$slug][0]{_id,title,subtitle,"slug":slug.current,publishedAt,logNumber,heroImage,"categories":categories[]->title,tags,body,tools,dataSources,aiAssistance,humanJudgment,limitations,"expedition":expedition->{title,"slug":slug.current}}`)

export const CASE_STUDIES_QUERY=defineQuery(`*[_type=="post"&&contentType=="caseStudy"]|order(publishedAt desc){_id,title,subtitle,"slug":slug.current,publishedAt,logNumber,heroImage,businessChallenge,intendedAudience,decisionSupported,tools,"categories":categories[]->title,tags}`)
export const CASE_STUDY_QUERY=defineQuery(`*[_type=="post"&&contentType=="caseStudy"&&slug.current==$slug][0]{_id,title,subtitle,"slug":slug.current,publishedAt,logNumber,heroImage,body,businessChallenge,intendedAudience,decisionSupported,dashboardUrl,tools,dataSources,aiAssistance,humanJudgment,limitations,"categories":categories[]->title,tags}`)

export const FIELD_NOTES_QUERY=defineQuery(`*[_type=="post"&&contentType=="fieldNote"]|order(coalesce(fieldDate,publishedAt) desc){_id,title,subtitle,"slug":slug.current,publishedAt,logNumber,fieldDate,fieldLocation,heroImage,"categories":categories[]->title,tags}`)
export const FIELD_NOTE_QUERY=defineQuery(`*[_type=="post"&&contentType=="fieldNote"&&slug.current==$slug][0]{_id,title,subtitle,"slug":slug.current,publishedAt,logNumber,fieldDate,fieldLocation,heroImage,"categories":categories[]->title,tags,body,tools,dataSources,aiAssistance,humanJudgment,limitations}`)

export const EXPEDITIONS_QUERY=defineQuery(`*[_type=="expedition"]|order(_updatedAt desc){_id,title,"slug":slug.current,summary,status,coverImage,"entries":*[_type=="post"&&references(^._id)]|order(publishedAt desc){_id,title,subtitle,contentType,"slug":slug.current,publishedAt,logNumber,"categories":categories[]->title,tags}}`)
export const EXPEDITION_QUERY=defineQuery(`*[_type=="expedition"&&slug.current==$slug][0]{_id,title,"slug":slug.current,summary,status,coverImage,"entries":*[_type=="post"&&references(^._id)]|order(publishedAt desc){_id,title,subtitle,contentType,"slug":slug.current,publishedAt,logNumber,"categories":categories[]->title,tags}}`)

export const FEATURED_INQUIRY_QUERY=defineQuery(`*[_type=="post"&&contentType=="inquiry"&&featured==true]|order(publishedAt desc)[0]{_id,title,subtitle,"slug":slug.current,publishedAt,logNumber,heroImage,"categories":categories[]->title,tags}`)
export const LATEST_LOG_QUERY=defineQuery(`*[_type=="post"]|order(publishedAt desc)[0...6]{_id,title,subtitle,contentType,"slug":slug.current,publishedAt,logNumber,heroImage,"categories":categories[]->title,tags}`)
