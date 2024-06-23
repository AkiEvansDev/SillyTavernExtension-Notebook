/* eslint-disable no-restricted-globals */
import { forEach } from 'lodash';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/**
 * Component for displaying a page in the notebook.
 * @param {object} props - Component props
 * @param {import('./App').Page} props.page - The page to display
 * @param {function} props.onChange - The function to call when the page content changes
 * @returns
 */
export default function Page({ page, onChange }) {

    const [value, setValue] = useState("");

    function getText(content, value) {
        const data = `
Introvert (I): introvert, reserved,
Extrovert (E): extrovert, outgoing,

Intuitive (N): intuitive, imaginative, creative, innovative,
Sensing (S): sensing, practical, observant, detail-oriented,

Thinking (T): thinking, rational, analytical, and decisive,
Feeling (F): feeling, empathetic, compassionate, considerate,

Perceiving (P): perceiving, flexible, spontaneous, open to new experiences,
Judging (J): judging, decisive, goal-oriented, and responsible,

The Reformer (1): strong sense of right and wrong, principled, idealistic, desire for personal growth, perfectionists,
	1w9: more emotionally expressive and less rigid in principles,
	1w2: more compassionate and emotionally sensitive,

The Helper (2): empathetic, caring, dedicated to the well-being of others, overly accommodating,
	2w1: more self-assured and less overly accommodating,
	2w3: more assertive and less self-sacrificing,

The Achiever (3): ambitious, goal-oriented, highly competitive, desire for success and recognition,
	3w2: more emotionally expressive and less driven by success and recognition,
	3w4: more sensitive and less competitive,

The Individualist (4): creative, sensitive, introspective, deeply in touch with emotions, may struggle with self-doubt and feelings of inadequacy,
	4w3: more assertive and less self-absorbed,
	4w5: more creative and less introverted,

The Investigator (5): curious, analytical, independent thinkers, may struggle with trusting others or opening up emotionally,
	5w4: more assertive and less detached,
	5w6: more responsible and less self-absorbed,

The Loyalist (6): trustworthy, responsible, reliable, may struggle with self-confidence and vulnerability,
	6w5: more creative and less overly cautious,
	6w7: more adaptable and less overly cautious,

The Enthusiast (7): adventurous, optimistic, spontaneous, desire for excitement and personal growth,
	7w8: more assertive and less self-absorbed,
	7w9: more emotionally expressive and less detached,

The Challenger (8): strong, assertive, confident, desire for control and power, may struggle with trusting others or opening up emotionally,
	8w7: more adaptable and less aggressive,
	8w9: more emotionally expressive and less aggressive,

The Peacemaker (9): gentle, compassionate, easygoing, desire for harmony and balance, too accommodating,
	9w8: more assertive and less detached,
	9w1: more self-assured and less overly accommodating,
`;

        if (value) {
            value = value.replaceAll('-', '');
            value = value.replaceAll('–', '');
            value = value.replaceAll('—', '');
            value = value.replaceAll(' ', '');

            if (value.length === 7) {
                var lines = data.split('\n');

                var type = value.substring(0, 4).split('');
                var subType = value.substring(4);

                var tags = "";
                var n1 = "";
                var n2_1 = "";
                var n2_2 = "";
                var n3 = "";

                lines.forEach((line) => {
                    line = line.trim();

                    if (line) {
                        if (type.some(t => line.includes(`(${t}):`))) {
                            tags += line.substring(line.indexOf(':') + 1);
                            n1 += line.substring(line.indexOf(':') - 2, 1);
                            n2_2 += line.substring(0, line.indexOf(':') - 4);
                        } else if (line.includes(`(${subType[0]}):`)) {
                            tags += line.substring(line.indexOf(':') + 1);
                            n2_1 += line.substring(0, line.indexOf(':') - 3);
                        } else if (line.includes(`${subType}:`)) {
                            tags += line.substring(line.indexOf(':') + 1);
                            n3 += subType;
                        }
                    }
                });

                if (tags) {
                    tags = tags.trim();
                    tags = tags.substring(0, tags.length - 1);

                    tags = `${n1} - ${n3}\n${n2_1}(${n2_2})\n[{{char}}'s Personality: ${tags};]`;

                    if (content) {
                        content += '\n' + tags;
                    } else
                        content = tags;
                }
            }
        }

        return content;
    }

    return (
        <div className="flex-container flexFlowColumn">
            <div className="flex-container alignItemsCenter">
                <input placeholder="Enter a title..." className="text_pole flex1" type="text" value={page.title} onChange={(event) => onChange({ ...page, title: event.target.value })} />
                <i className="right_menu_button fa-solid fa-trash" onClick={() => confirm('Are you sure?') && onChange(null)}></i>
            </div>
            <ReactQuill placeholder="What's on your mind?" theme="snow" value={page.content} onChange={(content) => onChange({ ...page, content })} scrollingContainer={document.getElementById('notebookPanelHolder')} />
            <div className="flex-container alignItemsCenter">
                <input placeholder="Input in format [XXXX - XwX]" className="text_pole flex1" type="text" value={value} onChange={(event) => setValue(event.target.value)} />
                <i className="right_menu_button fa-solid fa-magic-wand-sparkles" onClick={() => onChange({ ...page, content: getText(page.content, value) })}></i>
            </div>
        </div>
    );
}
