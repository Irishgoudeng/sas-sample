// import node module libraries
import { useRouter } from 'next/router'

// import profile layout wrapper
import ProfileLayoutWrap from 'layouts/marketing/ProfileLayoutWrap';

// import widget/custom components
import { ACNotificationsPage, GeeksSEO } from 'widgets';

const Notifications = () => {	
	const location = useRouter();	
	return (
		<ProfileLayoutWrap pathpara={location.pathname}>
			{/* Geeks SEO settings  */}
			<GeeksSEO title="Notifications | Geeks Nextjs Template" />

			<ACNotificationsPage/>
		</ProfileLayoutWrap>
	);
};

export default Notifications;
