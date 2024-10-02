// import node module libraries
import { Fragment } from 'react';

// import sub components
import { Collage, CareerAtGeeks, TeamMemberAtGeeks, GeeksCulture } from 'sub-components';

// import widget/custom components
import { CTAButton, GeeksSEO } from 'widgets';

// import your layout to override default layout 
import LayoutFooterLinks from 'layouts/marketing/LayoutFooterLinks';

const Career = () => {
	const title = 'Join the Geeks team & shape the future of design';
	const description = `If you’re passionate and ready to dive in, we’d love to meet you. We’re committed to supporting our employee professional development and well-being.`;
	const btntext = 'View opportunities';
	const btnlink = '#';

	return (
		<Fragment>
			{/* Geeks SEO settings  */}
			<GeeksSEO title="Career Page | Geeks Nextjs Template" />

			<main>
				{/* collage gallery */}
				<Collage />

				{/* career at geeks */}
				<CareerAtGeeks />

				{/* team member at geeks */}
				<TeamMemberAtGeeks />

				{/* geeks culture */}
				<GeeksCulture />

				{/* hero call to action */}
				<CTAButton
					title={title}
					description={description}
					btntext={btntext}
					btnlink={btnlink}
				/>
			</main>
		</Fragment>
	);
};

Career.Layout = LayoutFooterLinks;

export default Career;
