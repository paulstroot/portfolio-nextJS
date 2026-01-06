import { Document } from "@contentful/rich-text-types"
type contentfulImage = {
	fields: {
		file: {
			url: string
		}
	}
}
export type ProjectItem = {
	fields: {
		title: string
		slug: string
		order: number
		displayOnSite: boolean
		url: string
		description: Document
		summary: Document
		featuredImage: contentfulImage
		desktopLayout: contentfulImage
		mobileLayout: contentfulImage
		skills: SkillItems
	}
}

export type ProjectQueryResult = {
	items: ProjectItem[]
}

export type SkillItem = {
	fields: {
		name: string
		slug: string
		category: SkillCategoryItem[]
		order: number
		icon?: {
			fields: {
				file: {
					url: string
					title: string
					width: number
					height: number
				}
			}
		}
	}
}
export type SkillItems = ReadonlyArray<SkillItem>
export type SkillQueryResult = {
	items: SkillItems
}

export type SkillCategoryItem = {
	fields: {
		name: string
		order: number
	}
}
export type SkillCategoryItems = SkillCategoryItem[]
export type SkillCategoryQueryResult = {
	items: SkillCategoryItems
}
