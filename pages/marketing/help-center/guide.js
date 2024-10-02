// import node module libraries
import React, { Fragment } from 'react';
import { Row, Col, Container } from 'react-bootstrap';

// import widget/custom components
import { GeeksSEO }  from 'widgets';

// import sub components
import { HeaderBreadcrumb, ArticlesCategoryCard  }  from 'sub-components';

// import data files
import GuidesResourcesData from 'data/marketing/help-center/GuidesResourcesData';

// import your layout to override default layout 
import HelpCenterDarkLayout from 'layouts/marketing/HelpCenterDefaultLayout';

const HelpCenterGuide = () => {
	const breadcrumb = [
		{
			page: 'Help Center',
			link: '/marketing/help-center/'
		},
		{
			page: 'Guides & Resources',
			link: '#'
		}
	];

	return (
		<Fragment>

			{/* Geeks SEO settings  */}
			<GeeksSEO
				title="Guides & Resources | Geeks Nextjs Help Center"
				description="Geeks Nextjs help center guides & resources"
			/>

			{/* header and breadcrumb */}
			<HeaderBreadcrumb title="Guides & Resources" breadcrumb={breadcrumb} />

			{/* articles category listing cards */}
			<section className="py-10">
				<Container>
					<Row>
						<Col md={{ offset: 2, span: 8 }} xs={12}>
							<Row>
								{GuidesResourcesData.map((item, index) => {
									return (
										<Col lg={6} xs={12} key={index}>
											<ArticlesCategoryCard item={item} />
										</Col>
									);
								})}
							</Row>
						</Col>
					</Row>
				</Container>
			</section>
		</Fragment>
	);
};

HelpCenterGuide.Layout = HelpCenterDarkLayout;

export default HelpCenterGuide;
