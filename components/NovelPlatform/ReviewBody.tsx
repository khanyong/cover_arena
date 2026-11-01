import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {normalizeDisplayMath,remarkEquationCommentary} from '../../shared/lib/equationCommentary';
export default function Body({texts}:{texts:string[]}){return <>{texts.map((text,i)=><div key={i} data-review-block style={{marginBottom:18}}>{/^\d+\.$/.test(text.trim())?<p>{text}</p>:<ReactMarkdown remarkPlugins={[remarkMath,remarkEquationCommentary]} rehypePlugins={[rehypeKatex]}>{normalizeDisplayMath(text)}</ReactMarkdown>}</div>)}</>;}
