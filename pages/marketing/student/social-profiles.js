// import node module libraries
import { useRouter } from 'next/router'

// import profile layout wrapper
import ProfileLayoutWrap from 'layouts/marketing/ProfileLayoutWrap';

// import widget/custom components
import { ACSocialProfilesPage, GeeksSEO } from 'widgets';

const SocialProfiles = () => {	
	const location = useRouter();	
	return (
		<ProfileLayoutWrap pathpara={location.pathname}>
			{/* Geeks SEO settings  */}
			<GeeksSEO title="Social Profiles | Geeks Nextjs Template" />

			<ACSocialProfilesPage/>
		</ProfileLayoutWrap>
	);
};

export default SocialProfiles;
