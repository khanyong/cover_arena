import {useRouter} from 'next/router';
import type {GetServerSideProps} from 'next';
import NovelLocalReview from '../components/NovelPlatform/NovelLocalReview';

export const getServerSideProps:GetServerSideProps=async({req,res})=>{
 if(process.env.NODE_ENV!=='development')return {notFound:true};
 const {localRequest}=await import('../lib/novel-local-review/store.mjs');
 res.setHeader('Cache-Control','private, no-store');
 return localRequest(req)?{props:{}}:{notFound:true};
};
export default function LocalReview(){const router=useRouter();return <NovelLocalReview key={String(router.query.id||'catalog')}/>;}
