// import node module libraries
import { Fragment } from 'react';

// import widget/custom components
import { GeeksSEO }  from 'widgets';

// import sub components
import { ComparePlansTable, DeveloperGeeks, FAQs, PricingPlans }  from 'sub-components';

const ComparePlan = () => {
	return (
		<Fragment>
			{/* Geeks SEO settings  */}
			<GeeksSEO title="Compare Plan | Geeks Nextjs Template"/>

			{/* pricing plans  */}
			<PricingPlans />

			{/* compare plan & additional features */}
			<ComparePlansTable />

			{/* FAQs section */}
			<FAQs />

			{/* developer geeks */}
			<DeveloperGeeks />
		</Fragment>
	);
};

export default ComparePlan;
