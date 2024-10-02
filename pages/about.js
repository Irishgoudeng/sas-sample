// import node module libraries
import React, { Fragment } from 'react';
import { Container } from 'react-bootstrap';

// import widget/custom components
import { GeeksSEO } from 'widgets';

// import sub components
import { TeamGridRoundImages, JustifiedGallery, FeaturesList, HeroContent, CTAButton, Stat } from 'sub-components';

// import layouts
import NavbarDefault from 'layouts/marketing/navbars/NavbarDefault';
import FooterWithLinks from 'layouts/marketing/footers/FooterWithLinks';

// import your layout to override default layout 
import BlankLayout from 'layouts/marketing/BlankLayout';

const About = () => {
	return (
		<Fragment>
			{/* Geeks SEO settings  */}
			<GeeksSEO title="About us | Geeks Nextjs Template" />

			{/* Default Navbar */}
			<NavbarDefault login />

			<main>
				<section className="py-10 bg-white">
					<Container>
						{/* Hero Title */}
						<HeroContent />

						{/* Justified Gallery Section */}
						<JustifiedGallery />

						{/* 4 Columns Stat */}
						<Stat />
					</Container>
				</section>


				{/* Three Columns Features Section */}
				<FeaturesList />

				{/* Team Section in Rounded Image with Grid Layout */}
				<TeamGridRoundImages />

				{/* Hero Call to Action */}
				<CTAButton />
			</main>

			{/* Footer with links */}
			<FooterWithLinks />
		</Fragment>
	);
};

About.Layout = BlankLayout;

export default About;
