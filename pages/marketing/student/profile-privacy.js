// import node module libraries
import { useRouter } from 'next/router'

// import profile layout wrapper
import ProfileLayoutWrap from 'layouts/marketing/ProfileLayoutWrap';

// import widget/custom components
import { ACProfilePrivacyPage, GeeksSEO } from 'widgets';

const ProfilePrivacy = () => {	
	const location = useRouter();	
	return (
		<ProfileLayoutWrap pathpara={location.pathname}>
			{/* Geeks SEO settings  */}
			<GeeksSEO title="Profile Privacy | Geeks Nextjs Template" />
			
			<ACProfilePrivacyPage/>
		</ProfileLayoutWrap>
	);
};

export default ProfilePrivacy;
