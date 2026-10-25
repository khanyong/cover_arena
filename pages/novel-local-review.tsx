import type {GetServerSideProps} from 'next';
import NovelLocalReview from '../components/NovelPlatform/NovelLocalReview';

export const getServerSideProps:GetServerSideProps=async({req,res})=>{
 const {localRequest}=await import('../lib/novel-local-review/store.mjs');
 res.setHeader('Cache-Control','private, no-store');
 return localRequest(req)?{props:{}}:{notFound:true};
};
export default function LocalReview(){return <NovelLocalReview/>;}
