// import node module libraries
import { Fragment } from 'react';
import { Container } from 'react-bootstrap';

// import sub components
import { CoursesFeatures4Columns, BrowseCategories, WorldClassInstructors, HeroTyped, BecomeInstructor, CoursesTestimonialSection } from 'sub-components';

// import widget/custom components
import { LogosTopHeading, GeeksSEO, CTA2Buttons} from 'widgets';

// import layouts
import NavbarDefault from 'layouts/marketing/navbars/NavbarDefault';
import FooterWithLinks from 'layouts/marketing/footers/FooterWithLinks';

// import required data files
import LogoList2 from 'data/clientlogos/LogoList2';

// import your layout to override default layout 
import BlankLayout from 'layouts/marketing/BlankLayout';

const LandingCourses = () => {
	return (
		<Fragment>

			{/* Geeks SEO settings  */}
			<GeeksSEO title="Landing Course | Geeks Nextjs Template" />

			{/* Default Navbar */}
			<NavbarDefault />

			<main>

				{/* Page Content */}
				<HeroTyped />

				{/*  Featured in section */}
				<LogosTopHeading title="Featured In" logos={LogoList2} />

				{/* Why learn with geeks */}
				<CoursesFeatures4Columns />

				{/* Browse Categories Section  */}
				<BrowseCategories />

				<hr className="my-0" />

				{/*  World Class Instructors Section  */}
				<WorldClassInstructors />

				<section className="py-8 py-lg-16 bg-white">
					{/*  Become an Instructor  */}
					<BecomeInstructor />

					<Container>
						<hr className="my-10 my-lg-16" />
						{/*  Testimonials start */}
						<CoursesTestimonialSection />
					</Container>
				</section>

				{/*  CTA section */}
				<CTA2Buttons
					title="Join more than 1 million learners worldwide"
					description="Effective learning starts with assessment. Learning a new skill is hard work—Signal makes it easier."
					btntext1="Start Learning for Free"
					btnlink1="/authentication/sign-up"
					btntext2="Geeks for Business"
					btnlink2="/authentication/sign-up"
				/>

			</main>

			{/* Footer section */}
			<FooterWithLinks />
		</Fragment>
	);
};

LandingCourses.Layout = BlankLayout;

export default LandingCourses;
