import fs from 'fs';
import matter from 'gray-matter';
import { marked } from 'marked';
import path from 'path';
import './styles.css';
import { redirect } from 'next/navigation';

export default async function NotePage({ params }) {
    let documentData = await getDocument(params?.id);

    return (
        <div className='markdown-container'>
            <div dangerouslySetInnerHTML={{ __html: marked(documentData.data.content) }} />
        </div>
    );
}

export async function getDocument(fileName) {
    //const files = fs.readdirSync(path.join('src/documentData'));

    try {
        const markdownFile = fs.readFileSync(
            path.join('src/documents', `${fileName}.md`), 'utf-8'
        );

        const data = matter(markdownFile);

        return {
            data
        };
    } catch (error) {
        redirect('/');
    }

}
// use NotePage.getLayout to get a different header component