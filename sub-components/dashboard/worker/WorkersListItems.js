// import node module libraries
import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import {
	Dropdown,
	Image,
	OverlayTrigger,
	Tooltip
} from 'react-bootstrap';
import { MoreVertical, Trash, Edit, Mail } from 'react-feather';

import { useRouter } from 'next/router';

// import MDI icons
import Icon from '@mdi/react';
import { mdiStar } from '@mdi/js';

// import widget/custom components
import { TanstackTable } from 'widgets';

// import utility file
import { numberWithCommas } from 'helper/utils';

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';



const WorkersListItems = () => {
	const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchWorkers = async () => {
		  const usersRef = collection(db, 'users');
		  const snapshot = await getDocs(usersRef);
		  const workersData = snapshot.docs.map(doc => ({
			id: doc.id,
			name: `${doc.data().firstName} ${doc.data().middleName} ${doc.data().lastName}`,
			profilePicture: doc.data().profilePicture,
			workerId: doc.data().workerId,
		  }));
		  setWorkers(workersData);
		  setLoading(false);
		};
	  
		fetchWorkers();
	  }, []);
	
	// The forwardRef is important!!
	// Dropdown needs access to the DOM node in order to position the Menu
	const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
		<Link
		  href={{
			pathname: '/dashboard/workers/edit-worker',
			query: { workerId: '' },
		  }}
		  ref={ref}
		  onClick={(e) => {
			e.preventDefault();
			onClick(e);
		  }}
		  className="btn-icon btn btn-ghost btn-sm rounded-circle"
		>
		  {children}
		</Link>
	  ));

	CustomToggle.displayName = 'CustomToggle';

	const ActionMenu = ({ workerId }) => {
		const router = useRouter();

		const handleEditClick = (workerId) => {
			router.push({
			  pathname: '/dashboard/workers/edit-worker',
			  query: { workerId },
			});
		  };
		  
		return (
			<Dropdown>
			<Dropdown.Toggle as={CustomToggle}>
			  <MoreVertical size="15px" className="text-secondary" />
			</Dropdown.Toggle>
			<Dropdown.Menu align="end">
			  <Dropdown.Header>SETTINGS</Dropdown.Header>
			  <Dropdown.Item onClick={() => handleEditClick(workerId)}>
  <Edit size="15px" className="dropdown-item-icon" /> Edit
</Dropdown.Item>
			  <Dropdown.Item eventKey="2">
				<Trash size="15px" className="dropdown-item-icon" /> Remove
			  </Dropdown.Item>
			</Dropdown.Menu>
		  </Dropdown>
		);
	};

	const columns = useMemo(
		() => [
		  { accessorKey: 'id', header: 'ID' },
		  {
			accessorKey: 'name',
			header: 'Name',
			cell: ({ getValue, row }) => {
			  return (
				<div className="d-flex align-items-center">
				  <Image
					src={row.original.profilePicture}
					alt=""
					className="rounded-circle avatar-md me-2"
				  />
				  <h5 className="mb-0">{getValue()}</h5>
				</div>
			  );
			}
		  },

		{
			accessorKey: "shortcutmenu",
			header: "",
			cell: ({ row }) => {
			  return <ActionMenu workerId={row.original.workerId} />;
			}
		  }
		],
		[]
	  );

	const data = useMemo(() => workers, [workers]);

	return (
		<TanstackTable
			data={data}
			columns={columns}
			filter={true}
			filterPlaceholder="Search Workers"
			pagination={true} />
	);
};

export default WorkersListItems;
