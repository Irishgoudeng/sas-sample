// import node module libraries
import React, { Fragment, useEffect } from 'react'

// import sub components
import {
    EducationHeroRightImage,
    ExploreSkillCourses,
    BuildingSkills,
    LearnLatestSkills,
    EducationFeaturesWithBullets,
    UpcomingWebinars,
    FindRightCourse
} from 'sub-components';

// import layouts
import NavbarLanding from 'layouts/marketing/navbars/NavbarLanding';
import FooterCenter from 'layouts/marketing/footers/FooterWithLinks';

// import data files
import LogoList2 from 'data/clientlogos/LogoList2';

// import widget/custom components
import { LogosTopHeading3 } from 'widgets';

// import your layout to override default layout 
import BlankLayout from 'layouts/marketing/BlankLayout';

const LandingEducation = () => {
    useEffect(() => {
        document.body.className = 'bg-white';
    });

    return (
        <Fragment>
            {/*   Landing Page Navbar */}
            <NavbarLanding center />

            {/*   section  */}
            <main>

                {/*  learn today hero section */}
                <EducationHeroRightImage />

                {/*  trusted */}
                <LogosTopHeading3
                    title="TRUSTED BY OVER 12,500 GREAT TEAMS"
                    logos={LogoList2}
                    limit={5}
                />

                {/*  Explore skill courses */}
                <ExploreSkillCourses />

                {/*  Building strong foundational skills */}
                <BuildingSkills />

                {/*  Learn latest Skills */}
                <LearnLatestSkills />

                {/*  Features With Bullets */}
                <hr className="my-0 bg-transparent text-white" />
                <EducationFeaturesWithBullets />

                {/*  upcoming webinars */}
                <UpcomingWebinars />

                {/*  find right course */}
                <FindRightCourse />

            </main>

            {/*   Footer with center alignment */}
            <FooterCenter />

        </Fragment>
    )
}

LandingEducation.Layout = BlankLayout;

export default LandingEducation