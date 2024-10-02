// import node module libraries
import { Fragment } from 'react';

// import sub components
import { HeroFormCenter, HeroFormLeft, Features2Columns, RequestAccessTestimonialSection } from 'sub-components';

// import layouts
import NavbarLanding from 'layouts/marketing/navbars/NavbarLanding';
import FooterCenter from 'layouts/marketing/footers/FooterCenter';

// import widget/custom components
import { LogosTopHeadingOffset, GeeksSEO } from 'widgets';

// import required data files
import LogoList2 from 'data/clientlogos/LogoList2';

// import your layout to override default layout 
import BlankLayout from 'layouts/marketing/BlankLayout';

const RequestAccess = () => {
	return (
		<Fragment>

			{/* Geeks SEO settings  */}
			<GeeksSEO title="Request Access | Geeks Nextjs Template" />

			{/* Landing Page Navbar */}
			<NavbarLanding />
			<main>
				{/* Hero section with center form */}
				<HeroFormCenter />

				{/* Brand logo section */}
				<LogosTopHeadingOffset limit={4} offset={2} logos={LogoList2} />

				{/* Features : Out of the box */}
				<Features2Columns />

				{/* Testimonial slider section */}
				<RequestAccessTestimonialSection />

				{/* Hero section with left form */}
				<HeroFormLeft />
			</main>
			{/* Footer with center alignment */}
			<FooterCenter />
		</Fragment>
	);
};

RequestAccess.Layout = BlankLayout;

export default RequestAccess;
