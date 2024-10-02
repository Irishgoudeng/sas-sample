// import node module libraries
import { Fragment } from 'react';

// import widget/custom components
import { GeeksSEO } from 'widgets';

// import sub components
import { ContactSupportSection, HelpCenterFAQs, HeroGradientHeader } from 'sub-components';

// import your layout to override default layout 
import HelpCenterTransparentLayout from 'layouts/marketing/HelpCenterTransparentLayout';

const HelpCenter = () => {
	return (
		<Fragment>

			{/* Geeks SEO settings  */}
			<GeeksSEO
				title="Geeks Help Center | Geeks Nextjs"
				description="How can we help you? Have questions? Search through our Help Center"
			/>

			{/* hero gradient header with features */}
			<HeroGradientHeader />

			{/* FAQs section  */}
			<HelpCenterFAQs />

			{/* contact / support section */}
			<ContactSupportSection />
		</Fragment>
	);
};

HelpCenter.Layout = HelpCenterTransparentLayout;

export default HelpCenter;
