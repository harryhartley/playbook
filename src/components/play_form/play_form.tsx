import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { api } from "~/utils/api";
import { UploadButton } from "~/utils/uploadthing";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Character, Environment, Speed, Stage, Type } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  videoUrl: z.string(),
  thumbnailUrl: z.string().optional(),
  type: z.nativeEnum(Type),
  speed: z.nativeEnum(Speed),
  environment: z.nativeEnum(Environment),
  character: z.nativeEnum(Character),
  stage: z.nativeEnum(Stage),
  difficulty: z.string().regex(/^[1-5]$/),
});

type PlayFormProps = Partial<z.infer<typeof formSchema>>;

export function PlayForm({
  id,
  name,
  description,
  videoUrl,
  thumbnailUrl,
  type,
  speed,
  environment,
  character,
  stage,
  difficulty,
}: PlayFormProps) {
  const queries = api.useContext();
  const createPlay = api.play.create.useMutation({
    onSuccess: () => queries.play.invalidate(),
  });
  const updatePlay = api.play.update.useMutation({
    onSuccess: () => queries.play.invalidate(),
  });
  const deleteFile = api.uploadthing.deleteFile.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
      description,
      videoUrl,
      thumbnailUrl,
      type,
      speed,
      environment,
      character,
      stage,
      difficulty,
    },
  });

  async function onSubmit() {
    await form.trigger();
    const errors = Object.keys(form.formState.errors);
    if (errors.length > 0) {
      throw new Error("Form has errors");
    }
    if (!!id) {
      updatePlay.mutate({
        id,
        ...form.getValues(),
        difficulty: Number(form.getValues().difficulty),
      });
    } else {
      createPlay.mutate({
        ...form.getValues(),
        difficulty: Number(form.getValues().difficulty),
        gameAbbr: "llb",
      });
    }
  }

  function onClose() {
    if (videoUploadUrl) {
      deleteFile.mutate({ fileUrl: videoUploadUrl });
      setVideoUploadUrl("");
    }
    if (thumbnailUploadUrl) {
      deleteFile.mutate({ fileUrl: thumbnailUploadUrl });
      setThumbnailUploadUrl("");
    }
    form.reset();
  }

  const [videoUploadUrl, setVideoUploadUrl] = useState<string>(videoUrl ?? "");
  const [thumbnailUploadUrl, setThumbnailUploadUrl] = useState<string>(
    thumbnailUrl ?? "",
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          {id ? <Edit size={14} /> : <Plus />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? `Update Play ${id}` : "Create Play"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Play Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="character"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Character *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(Character).map((type, idx) => (
                        <SelectItem key={idx} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Play Type *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(Type).map((type, idx) => (
                        <SelectItem key={idx} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="speed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Play Speed *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(Speed).map((type, idx) => (
                        <SelectItem key={idx} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="environment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Play Environment *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(Environment).map((type, idx) => (
                        <SelectItem key={idx} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stage *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(Stage).map((type, idx) => (
                        <SelectItem key={idx} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["1", "2", "3", "4", "5"].map((type, idx) => (
                        <SelectItem key={idx} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {videoUploadUrl ? (
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL *</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="videoUrl"
                render={() => (
                  <FormItem>
                    <FormLabel>Video URL *</FormLabel>
                    <UploadButton
                      className="py-4"
                      endpoint="mp4Uploader"
                      onClientUploadComplete={(res) => {
                        console.log("Files: ", res);
                        if (res && res.length > 0) {
                          setVideoUploadUrl(res[0]?.url ?? "");
                          form.setValue("videoUrl", res[0]?.url ?? "");
                        }
                      }}
                      onUploadError={(err) => {
                        console.log("Error: ", err);
                      }}
                    />
                  </FormItem>
                )}
              />
            )}
            {thumbnailUploadUrl ? (
              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={() => (
                  <FormItem>
                    <FormLabel>Thumbnail URL</FormLabel>
                    <UploadButton
                      className="py-4"
                      endpoint="pngUploader"
                      onClientUploadComplete={(res) => {
                        console.log("Files: ", res);
                        if (res && res.length > 0) {
                          setThumbnailUploadUrl(res[0]?.url ?? "");
                          form.setValue("thumbnailUrl", res[0]?.url ?? "");
                        }
                      }}
                      onUploadError={(err) => {
                        console.log("Error: ", err);
                      }}
                    />
                  </FormItem>
                )}
              />
            )}
          </form>
        </Form>
        <DialogFooter className="flex sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={onClose}>
              Close
            </Button>
          </DialogClose>
          <Button type="submit" onClick={onSubmit}>
            Save Play
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
