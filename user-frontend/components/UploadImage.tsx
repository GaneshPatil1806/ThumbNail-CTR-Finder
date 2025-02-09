"use client"
import axios from "axios";
import { headers } from "next/headers";
import { useState } from "react"
const BACKEND_URL = "http://localhost:4000";
const CLOUDFRONT_URL = "https://d3ppmigsqvkiof.cloudfront.net";

export function UploadImage({ onImageAdded, image }: {
    onImageAdded: (image: string) => void;
    image?: string;
}) {
    const [uploading, setUploading] = useState(false);

    async function onFileSelect(e: any) {
        setUploading(true);
        try {
            const file = e.target.files[0];
            const response = await axios.get(`${BACKEND_URL}/v1/user/presignedUrl`, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });
            const presignedUrl = response.data.preSignedUrl;
            const formData = {
                "bucket":response.data.fields["bucket"],
                "X-Amz-Algorithm":response.data.fields["X-Amz-Algorithm"],
                "X-Amz-Credential":response.data.fields["X-Amz-Credential"],
                "X-Amz-Date":response.data.fields["X-Amz-Date"],
                "key":response.data.fields["key"],
                "Policy":response.data.fields["Policy"],
                "X-Amz-Signature":response.data.fields["X-Amz-Signature"],
                "file":file
            }
            
            //'console.log("formData",formData);
            
            const awsResponse = await fetch(presignedUrl,{
                method: 'POST',
                body: formData
            });

            console.log(awsResponse);

            onImageAdded(`${CLOUDFRONT_URL}/:response.data.fields["key"]}`);
        } catch(e) {
            console.log(e)
        }
        setUploading(false);
    }

    if (image) {
        return <img className={"p-2 w-96 rounded"} src={image} />
    }

    return <div>
        <div className="w-40 h-40 rounded border text-2xl cursor-pointer">
                <div className="h-full flex justify-center flex-col relative w-full">
                    <div className="h-full flex justify-center w-full pt-16 text-4xl">
                    {uploading ? <div className="text-sm">Loading...</div> : <>
                        +
                        <input className="w-full h-full bg-red-400 w-40 h-40" type="file" style={{position: "absolute", opacity: 0, top: 0, left: 0, bottom: 0, right: 0, width: "100%", height: "100%"}} onChange={onFileSelect} />
                    </>}
                </div>
            </div>
        </div>
    </div>
}