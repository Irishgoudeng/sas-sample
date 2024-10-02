// import node module libraries
import { Fragment } from 'react';

// import widget/custom components
import { GeeksSEO } from 'widgets';

// import sub components
import { HeroCollage, CareerPositions } from 'sub-components';

// import your layout to override default layout 
import LayoutFooterLinks from 'layouts/marketing/LayoutFooterLinks';

const CareerList = () => {
	return (
		<Fragment>
			{/* Geeks SEO settings  */}
			<GeeksSEO title="Career List | Geeks Nextjs Template" />

			<main>
				{/* hero with collage */}
				<HeroCollage />

				{/* career positions */}
				<CareerPositions />
			</main>
		</Fragment>
	);
};

CareerList.Layout = LayoutFooterLinks;

export default CareerList;
