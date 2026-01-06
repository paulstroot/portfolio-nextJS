import { HeroClean, HeroStuntman, HeroWildwest, HeroWrestler } from "@/app/components/heros"

export default async function Hero() {
	return (
		<>
			<div className="only-theme-wrestler">
				<HeroWrestler />
			</div>
			<div className="only-theme-default">
				<HeroStuntman />
			</div>
			<div className="only-theme-wildwest">
				<HeroWildwest />
			</div>
			<div className="only-theme-clean">
				<HeroClean />
			</div>
		</>
	)
}
