import { useRouter } from 'next/router';

export default function Post({ post }) {
  if (!post) {
    return <div>포스트 데이터를 찾을 수 없습니다.</div>;
  }
  return (
    <div style={{ padding: 32 }}>
      <h1>Post ID: {post.id}</h1>
      <p>Title: {post.title}</p>
      <p>Content: {post.content}</p>
    </div>
  );
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { id: '1' } },
      { params: { id: '2' } },
      { params: { id: '3' } },
    ],
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { id } = params;
  // 더미 데이터
  const post = {
    id,
    title: `Post Title ${id}`,
    content: `This is the content for post ${id}.`,
  };
  return {
    props: { post },
  };
} 