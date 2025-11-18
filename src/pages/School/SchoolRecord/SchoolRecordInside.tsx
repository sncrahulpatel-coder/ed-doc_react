import React from 'react';
import './SchoolRecordInside.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function SchoolRecordInside() {
    const location = useLocation();
    const { data } = (location.state as { data: any }) || { data: null };

    if (!data || data.length === 0) return <p>No Data Found</p>;

    const record = data[0]; // Because your structure is an array with 1 item
    const topicTitle = record.title;
    const subTopics = record.SubTopics;

    // Fixed positions in order
    const positions = ["left", "top-left", "bottom", "top-right", "right"];
  const navigate = useNavigate();

    return (
        <div className="admin-gov-container">
            <h2 className="diagram-title">{topicTitle}</h2>

            <div className="diagram-area">
                <img
                    src="/School/innerfolderpagebackground.png"
                    alt="Central Graphic"
                    className="central-image"
                />

                {subTopics.map((item: any, index: number) => (
                    <button
                        key={index}
                        className={`Edbutton ${positions[index]} ${item.title == "Coming Soon" && 'disabled'}`}
                        onClick={() => {
                            console.log(item)
                            if(item.type){
                                navigate('View',{
                                    state :{
                                        type:item.type,
                                        title:item.title
                                    } 
                                })
                            }else{
                                toast.success("Coming Soon")
                            }
                        }}
                        dangerouslySetInnerHTML={{ __html: item.title }}
                    />
                ))}
            </div>
        </div>
    );
}
