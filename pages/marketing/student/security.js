// import node module libraries
import { useRouter } from 'next/router'

// import profile layout wrapper
import ProfileLayoutWrap from 'layouts/marketing/ProfileLayoutWrap';

// import widget/custom components
import { ACSecuirtyPage, GeeksSEO } from 'widgets'; 

const Security = () => {	
	const location = useRouter();	
	return (
		<ProfileLayoutWrap pathpara={location.pathname}>
			{/* Geeks SEO settings  */}
			<GeeksSEO title="Security | Geeks Nextjs Template" />

			<ACSecuirtyPage/>
		</ProfileLayoutWrap>
	);
};

export default Security;
