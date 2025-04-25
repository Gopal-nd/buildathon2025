"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MapPin } from 'lucide-react';
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  location: z.string().min(2, "Location must be at least 2 characters"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  farmSize: z.number().min(0.1, "Farm size must be greater than 0"),
  cropType: z.string().min(1, "Please select a crop type"),
  currentCrop: z.string().min(2, "Current crop must be at least 2 characters").optional(),
});



type FormValues = z.infer<typeof formSchema>;



const updateUserProfile = async (data: FormValues) => {
  const response = await fetch("/api/user/farme", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update profile");
  }
  
  return response.json();
};

export default function ProfilePage() {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const queryClient = useQueryClient();
  

  const {data, isLoading , error} = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await fetch("/api/user/farme");
      return response.json();
    },
  })


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      latitude: undefined,
      longitude: undefined,
      farmSize: undefined,
      cropType: "",
      currentCrop: "",
    },
  });

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });


  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsGettingLocation(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue("latitude", position.coords.latitude);
        form.setValue("longitude", position.coords.longitude);
        
        // Try to get location name from coordinates using reverse geocoding
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
          .then(res => res.json())
          .then(data => {
            if (data.display_name) {
              form.setValue("location", data.display_name);
            }
          })
          .catch(() => {
                toast.error('Error in the getting the location')
          })
          .finally(() => {
            setIsGettingLocation(false);
          });
      },
      (error) => {
        let message = "Failed to get location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location permission denied";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            message = "Location request timed out";
            break;
        }
        
        toast.error(message);
        setIsGettingLocation(false);
      }
    );
  };

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };


  useEffect(()=>{
    if(data){
      form.setValue("location", data.location);
      form.setValue("latitude", data.latitude);
      form.setValue("longitude", data.longitude);
      form.setValue("farmSize", data.farmSize);
      form.setValue("cropType", data.cropType);
      form.setValue("currentCrop", data.currentCrop);
    }
  },[data])

  return (
    <div className="container mx-auto max-w-xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Farm Profile</CardTitle>
          <CardDescription>
            Update your farm details and location information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="Enter your farm location" {...field} />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={getCurrentLocation}
                          disabled={isGettingLocation}
                        >
                          {isGettingLocation ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <MapPin className="h-4 w-4 mr-2" />
                          )}
                          {isGettingLocation ? "Getting..." : "Get Location"}
                        </Button>
                      </div>
                      <FormDescription>
                        Your farm's address or general location
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="any"
                            placeholder="Latitude" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                            value={field.value === undefined ? "" : field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="any"
                            placeholder="Longitude" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                            value={field.value === undefined ? "" : field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="farmSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Farm Size (hectares)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          placeholder="Enter farm size" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          value={field.value === undefined ? "" : field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        Size of your farm in hectares
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cropType"
                  render={({ field }) => (
                    <FormItem>
                    <FormLabel>Intrested Crops</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter  crop you are intrested " {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the crops u are intrested in growing
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentCrop"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Crop</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter current crop" {...field} />
                      </FormControl>
                      <FormDescription>
                        What are you currently growing?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Profile"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
