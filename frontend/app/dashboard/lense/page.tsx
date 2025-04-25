'use client'

import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { ArrowBigLeft, ImageIcon } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {marked} from 'marked'

const ImageRecognitionPage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [Toggle, setToggle] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const { mutate,data:AIresponse, isError, isSuccess, isPending, error } = useMutation({
    mutationKey: ['image'],
    mutationFn: async (formData: FormData) => {
      const data = await axios.post('/api/lense', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      alert('Please upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('text',Toggle? prompt: 'if it is a image of any plant or the tree or leves, look for the health of that ,if any defect or disease, give a 100 character of description and suggest the medicines are other ways to treat the disease ,and finaly write some words about the plant and crop irrigation and farming in simple words ..., if not any plant or tree or related to farming , then write a description of the image in 200 characters .');

    mutate(formData);
  };

  if (isError) {
    console.log(error);
  }
 
  if (AIresponse?.status === 300) {
    alert(AIresponse?.data?.error);
  }
  const router = useRouter()
  return (
    <div className='space-y-6'>
            <div className='flex items-center  '>
            <Button onClick={() => router.back()}><ArrowBigLeft /></Button>
      <h1 className='flex-1 text-2xl font-semibold text-center'>
        Select Image for Recognition  
      </h1>
      </div>
      <div className='max-w-3xl mx-auto'>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-2">Upload an Image to recognize Plants And Diseases</label>
            {!selectedImage ? (
              <div
                onClick={handleIconClick}
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer"
              >
                <ImageIcon className="text-gray-400 text-6xl mb-2" />
                <p className="text-gray-500">Choose an image</p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  className="w-full max-w-xs h-64 object-cover rounded-lg cursor-pointer"
                  style={{ maxWidth: '500px', maxHeight: '500px' }}
                  onClick={handleIconClick}
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute bottom-2 left-2 bg-red-500 text-white p-1 rounded-md"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div>
          <div className="flex items-center mb-2">
            <input
              id="toggle"
              type="checkbox"
              className="mr-2 size-5"
              checked={Toggle}
              onChange={(e) => setToggle(e.target.checked)}
            />
            <label htmlFor="toggle" className="text-lg">
              Write Custom Prompt
            </label>
          </div>
        { Toggle && <>
       <label className="block font-semibold mb-2">Optional Prompt</label>
            <Input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the content or provide additional info..."
              className="block w-full p-2 border border-gray-300 rounded-lg"
            />
              </> }

          </div>

          <div>
            <button
              type="submit"
              className={`w-full p-3 rounded-lg bg-blue-500 text-white font-bold ${
                isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
              disabled={isPending}
            >
              {isPending ? 'Processing...' : 'Analyze Image'}
            </button>
          </div>

          {isError && (
            <p className="mt-4 text-red-500 text-center">Error: {error.message}</p>
          )}
          {isSuccess && (
           <div className="mt-6 p-4  rounded-lg">
           <h2 className="text-xl font-semibold mb-2">AI Analysis:</h2>
           <p className="whitespace-pre-wrap">
            <div dangerouslySetInnerHTML={{ __html: marked.parse(AIresponse.data.aiResponse) }}></div>
           </p>
         </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ImageRecognitionPage;



