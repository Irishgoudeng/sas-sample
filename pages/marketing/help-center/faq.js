// import node module libraries
import { Fragment } from 'react';

// import widget/custom components
import { GeeksSEO }  from 'widgets';

// import sub components
import { HeaderBreadcrumb, AllFAQsList  }  from 'sub-components';

// import your layout to override default layout 
import HelpCenterDefaultLayout from 'layouts/marketing/HelpCenterDefaultLayout';

const HelpCenterFAQ = () => {	
	const breadcrumb = [
		{
			page: 'Help Center',
			link: '/marketing/help-center/'
		},
		{
			page: 'Faq',
			link: '#'
		}
	];

	return (
		<Fragment>

			{/* Geeks SEO settings  */}
			<GeeksSEO
				title="Help Center FAQs | Geeks Nextjs"
				description="Geeks UI Help Center Frequently Asked Questions"
			/>

			{/* header and breadcrumb */}
			<HeaderBreadcrumb
				title="Frequently Asked Questions"
				breadcrumb={breadcrumb}
			/>

			{/* Most asked, General inquiries and Support FAQs section */}
			<AllFAQsList />
		</Fragment>
	);
};

HelpCenterFAQ.Layout = HelpCenterDefaultLayout;

export default HelpCenterFAQ;
