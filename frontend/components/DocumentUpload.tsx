"use client";

import React, { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";
import { toast } from "sonner";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import DocumentAccordion from "./DocumentList";
import { Button } from "./ui/button";

const DocumentUpload = ({ id }: { id: string }) => {
  const [doc,setdoc]=React.useState<any>(null)
  const [loading,setLoading] = useState(false)

  const handleUploadComplete = async (res: any[]) => {
    if (!res || res.length === 0) {
      toast.error("Upload failed.");
      return;
    }

    setLoading(true)

    const fileURL = res[0].url;

    try {
     const response =  await axios.post("/api/upload", {
        fileURL,
        filename: res[0].name,
        userId: id,
      });
      console.log(response)
      setdoc(response.data.data)
      
      toast.success("Document uploaded successfully!");
    } catch (err) {
      toast.error("Error saving document info.");
      console.error(err);
    }finally{
      setLoading(false)
    }
  };
  const {data,isLoading} = useQuery({
    queryKey: ["userProfile",'documets'],
    queryFn:async()=>{
      const res = await axios.get('/api/upload/all')
      return res.data.dataSets
    }
  })

  if(isLoading){
<div>Loading</div>
  }
  console.log(data)

  return (
    <div className="flex flex-col gap-4  justify-between">
<div className="flex justify-between items-center">

<DocumentAccordion documents={data} setpfdUrl={setdoc}/>
<Button onClick={()=>setdoc(null)}>add</Button>
</div>
   {!doc && <div className="p-4 border rounded-lg flex-1">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={handleUploadComplete}
        onUploadError={(error: Error) => {
          toast.error(`Upload Error: ${error.message}`);
        }}
      />
      {loading && (
        <div className="flex items-center justify-center mt-4">
          <div className=" rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900">Analizing data</div>
        </div>
      )}

      
    </div>}
    {
        doc && (
          <iframe
          src={doc!}
          className="w-[500px] h-[600px] border"
          title="PDF Preview"
          ></iframe>
        )
      }
    </div>

  );
};

export default DocumentUpload;
