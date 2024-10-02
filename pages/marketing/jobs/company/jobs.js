// import node module libraries
import ReactPaginate from 'react-paginate';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';

// import widget/custom components
import { JobListingListviewCard } from 'widgets';

// import sub components 
import { CompanyCommonHeaderTabs } from 'sub-components';

// import data files
import JobsListingData from 'data/marketing/jobs/JobsListingData';
import ComapniesListData from 'data/marketing/jobs/CompaniesListData';

// import your layout to override default layout 
import JobListingLayout from 'layouts/marketing/JobListingLayout';

const Jobs = () => {
  const data = ComapniesListData[0]
  const [Records] = useState(JobsListingData);
  // paging setup start
  const [pageNumber, setPageNumber] = useState(0);
  const RecordsPerPage = 5;
  const pagesVisited = pageNumber * RecordsPerPage;
  const pageCount = Math.ceil(Records.length / RecordsPerPage);
  const changePage = ({ selected }) => { setPageNumber(selected) };
  const displayRecords = Records.slice(pagesVisited, pagesVisited + RecordsPerPage).map((record, index) => {
    return (<JobListingListviewCard item={record} key={index} />);
  });
  // end of paging setup

  return (
    <CompanyCommonHeaderTabs data={data}>
    <h2 className="mb-4">{data.jobPosting} jobs openings</h2>
    {displayRecords.length > 0 ? displayRecords : <div>No matching records found.</div>}
      <ReactPaginate
        previousLabel={<ChevronLeft size="14px" />}
        nextLabel={<ChevronRight size="14px" />}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={'justify-content-center mb-0 pagination'}
        previousLinkClassName={'page-link mx-1 rounded'}
        nextLinkClassName={'page-link mx-1 rounded'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link mx-1 rounded'}
        disabledClassName={'paginationDisabled'}
        activeClassName={'active'}
      />
    </CompanyCommonHeaderTabs>
  )
}

Jobs.Layout = JobListingLayout;

export default Jobs