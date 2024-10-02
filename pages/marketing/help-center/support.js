// import node module libraries
import { Fragment } from 'react';

// import widget/custom components
import { GeeksSEO }  from 'widgets';

// import sub components
import { HeaderBreadcrumb, SupportForm  }  from 'sub-components';

// import your layout to override default layout 
import HelpCenterDarkLayout from 'layouts/marketing/HelpCenterDefaultLayout';

const HelpCenterSupport = () => {
	const breadcrumb = [
		{
			page: 'Help Center',
			link: '/marketing/help-center/'
		},
		{
			page: 'Support',
			link: '#'
		}
	];

	return (
		<Fragment>

			{/* Geeks SEO settings  */}
			<GeeksSEO
				title="Support | Geeks Nextjs Help Center"
				description="Get in touch with the document Support team, we will be glad to assist you.."
			/>
			
			{/* header and breadcrumb */}
			<HeaderBreadcrumb title="Support" breadcrumb={breadcrumb} />
			
			{/* support form  */}
			<SupportForm />			
		</Fragment>
	);
};

HelpCenterSupport.Layout = HelpCenterDarkLayout;

export default HelpCenterSupport;
