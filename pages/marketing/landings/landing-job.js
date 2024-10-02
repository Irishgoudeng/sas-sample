import { Fragment } from 'react';

// import widget/custom components
import { LogosTopHeadingOffset2, GeeksSEO } from 'widgets';

// import sub components 
import { BrowseJobCategories, CustomerStories, FindYourDreamJob, HowItWorks, LatestJobOpening, TopCompanies } from 'sub-components';

// import data files
import LogoList2 from 'data/clientlogos/LogoList2';

// import your layout to override default layout 
import JobListingLayout from 'layouts/marketing/JobListingLayout';

const LandingJob = () => {
    return (
        <Fragment>

            {/* Geeks SEO settings  */}
            <GeeksSEO title="Jobs | Geeks Nextjs Template" />

            <main>
                {/* Find your dream job section */}
                <FindYourDreamJob />

                {/* Logos section  */}
                <section className="py-8 bg-white">
                    <LogosTopHeadingOffset2 limit={5} offset={1} logos={LogoList2} />
                </section>

                {/* Latest Job Opening section */}
                <LatestJobOpening />

                {/* How It Works section */}
                <HowItWorks />

                {/* Browse Category section */}
                <BrowseJobCategories />

                {/* Customer stories section */}
                <CustomerStories />

                {/* Top companies hiring section */}
                <TopCompanies />

            </main>
        </Fragment>
    )
}

LandingJob.Layout = JobListingLayout;

export default LandingJob