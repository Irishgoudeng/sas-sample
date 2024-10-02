// import node module libraries
import { useRouter } from 'next/router'

// import profile layout wrapper
import ProfileLayoutWrap from 'layouts/marketing/ProfileLayoutWrap';

// import widget/custom components
import { ACDeleteProfilePage, GeeksSEO } from 'widgets';

const DeleteProfile = () => {	
	const location = useRouter();	
	return (
		<ProfileLayoutWrap pathpara={location.pathname}>
			<GeeksSEO title="Delete Profile | Geeks Nextjs Template" />
			<ACDeleteProfilePage/>
		</ProfileLayoutWrap>
	);
};

export default DeleteProfile;
