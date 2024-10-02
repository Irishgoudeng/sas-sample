// import node module libraries
import { useRouter } from 'next/router'

// import profile layout wrapper
import ProfileLayoutWrap from 'layouts/marketing/ProfileLayoutWrap';

// import widget/custom components
import { ACEditProfilePage, GeeksSEO } from 'widgets';

const EditProfile = () => {	
	const location = useRouter();	
	return (
		<ProfileLayoutWrap pathpara={location.pathname}>			
			{/* Geeks SEO settings  */}
			<GeeksSEO title="Profile Edit | Geeks Nextjs Template" />

			<ACEditProfilePage/>
		</ProfileLayoutWrap>
	);
};

export default EditProfile;
