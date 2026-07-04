"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExt from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import slugify from "slugify";
import { createClient } from "@/lib/supabaseClient";

// This component is the entire "write and publish a post without touching code" experience.
// It renders a real rich-text editor (bold/italic/headings/images/YouTube embeds/links/lists),
// uploads images straight to Supabase Storage, and saves the post to the database.
export default function PostEditor({ post }) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = Boolean(post);

  const [title, setTitle] = useState(post?.title || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [categoryId, setCategoryId] = useState(post?.category_id || "");
  const [categories, setCategories] = useState([]);
  const [tagsInput, setTagsInput] = useState("");
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image || "");
  const [status, setStatus] = useState(post?.status || "draft");
  const [publishDate, setPublishDate] = useState(
    post?.published_at ? post.published_at.slice(0, 10) : new Date().toISOString().slice(0, 10)
  );
  const [saving, setSaving] = useState(false);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [message, setMessage] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExt,
      Link.configure({ openOnClick: false }),
      Youtube.configure({ width: 640, height: 360 }),
      Placeholder.configure({ placeholder: "Start writing your story..." }),
    ],
    content: post?.content || "",
    immediatelyRender: false,
  });

  useEffect(() => {
    supabase.from("categories").select("*").order("name").then(({ data }) => setCategories(data || []));
    if (isEditing) {
      supabase
        .from("post_tags")
        .select("tags(name)")
        .eq("post_id", post.id)
        .then(({ data }) => setTagsInput((data || []).map((t) => t.tags?.name).filter(Boolean).join(", ")));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadImage = useCallback(
    async (file) => {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("blog-images").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
      return data.publicUrl;
    },
    [supabase]
  );

  async function handleFeaturedImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFeatured(true);
    try {
      const url = await uploadImage(file);
      setFeaturedImage(url);
    } catch (err) {
      alert("Image upload failed: " + err.message);
    } finally {
      setUploadingFeatured(false);
    }
  }

  async function insertEditorImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      alert("Image upload failed: " + err.message);
    }
    e.target.value = "";
  }

  function insertYoutube() {
    const url = prompt("Paste the YouTube video URL:");
    if (url) editor.commands.setYoutubeVideo({ src: url });
  }

  function insertLink() {
    const url = prompt("Link URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  }

  async function syncTags(postId) {
    const names = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const tagIds = [];
    for (const name of names) {
      const slug = slugify(name, { lower: true });
      let { data: existing } = await supabase.from("tags").select("id").eq("slug", slug).maybeSingle();
      if (!existing) {
        const { data: created } = await supabase.from("tags").insert({ name, slug }).select().single();
        existing = created;
      }
      if (existing) tagIds.push(existing.id);
    }
    await supabase.from("post_tags").delete().eq("post_id", postId);
    if (tagIds.length) {
      await supabase.from("post_tags").insert(tagIds.map((tag_id) => ({ post_id: postId, tag_id })));
    }
  }

  async function handleSave(publishNow) {
    if (!title.trim()) {
      setMessage("Please add a title first.");
      return;
    }
    setSaving(true);
    setMessage("");

    const html = editor.getHTML();
    const wordCount = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.round(wordCount / 200));

    const finalStatus = publishNow ? "published" : status;
    const publishedAt =
      finalStatus === "published"
        ? new Date().toISOString()
        : finalStatus === "scheduled"
        ? new Date(publishDate).toISOString()
        : null;

    const payload = {
      title,
      excerpt,
      content: html,
      featured_image: featuredImage || null,
      category_id: categoryId || null,
      status: finalStatus,
      published_at: publishedAt,
      reading_time: readingTime,
    };

    if (!isEditing) payload.slug = slugify(title, { lower: true, strict: true }) + "-" + Date.now().toString(36);

    let savedId = post?.id;
    if (isEditing) {
      const { error } = await supabase.from("posts").update(payload).eq("id", post.id);
      if (error) { setMessage(error.message); setSaving(false); return; }
    } else {
      const { data, error } = await supabase.from("posts").insert(payload).select().single();
      if (error) { setMessage(error.message); setSaving(false); return; }
      savedId = data.id;
    }

    await syncTags(savedId);

    setSaving(false);
    setMessage(finalStatus === "published" ? "Published!" : "Saved.");
    router.push("/admin/posts");
    router.refresh();
  }

  if (!editor) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display font-semibold text-2xl text-pine-deep">{isEditing ? "Edit Post" : "New Post"}</h1>
        <div className="flex gap-2.5">
          <button onClick={() => handleSave(false)} disabled={saving} className="border border-[#D8D3C4] text-sm px-4 py-2.5 rounded bg-white disabled:opacity-60">
            Save Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} className="bg-pine-deep text-white text-sm font-medium px-5 py-2.5 rounded disabled:opacity-60">
            {saving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      {message && <p className="mb-5 text-sm bg-[#DEEAE2] text-pine px-4 py-2.5 rounded inline-block">{message}</p>}

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
            className="w-full font-display text-[26px] font-semibold border-b border-pine/10 pb-3.5 mb-5 bg-transparent text-pine-deep focus:outline-none focus:border-pine"
          />

          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Short excerpt shown on blog cards..."
            rows={2}
            className="w-full mb-5 border border-[#D8D3C4] rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-pine"
          />

          <div className="border border-pine/10 rounded-t bg-[#FBF9F4] p-2 flex flex-wrap gap-1">
            <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>B</ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><i>I</i></ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>H2</ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>H3</ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>&ldquo;&rdquo;</ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>• List</ToolBtn>
            <ToolBtn onClick={insertLink}>🔗</ToolBtn>
            <label className="w-9 h-9 flex items-center justify-center rounded hover:bg-[#EDE8DA] cursor-pointer text-sm">
              🖼<input type="file" accept="image/*" className="hidden" onChange={insertEditorImage} />
            </label>
            <ToolBtn onClick={insertYoutube}>▶</ToolBtn>
          </div>
          <div className="border border-t-0 border-pine/10 rounded-b bg-white p-4 min-h-[320px] prose-himalaya" onClick={() => editor.chain().focus().run()}>
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-pine/10 rounded p-4">
            <h4 className="font-mono text-[11px] uppercase tracking-wide text-[#8a8776] mb-3">Featured Image</h4>
            {featuredImage ? (
              <img src={featuredImage} alt="" className="w-full rounded mb-2" />
            ) : (
              <div className="border-2 border-dashed border-[#D8D3C4] rounded p-6 text-center text-xs text-[#8a8776] mb-2">No image yet</div>
            )}
            <label className="block text-center border border-[#D8D3C4] rounded text-xs py-2 cursor-pointer">
              {uploadingFeatured ? "Uploading..." : "Upload image"}
              <input type="file" accept="image/*" className="hidden" onChange={handleFeaturedImageChange} />
            </label>
          </div>

          <div className="bg-white border border-pine/10 rounded p-4">
            <h4 className="font-mono text-[11px] uppercase tracking-wide text-[#8a8776] mb-3">Category</h4>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full border border-[#D8D3C4] rounded px-3 py-2 text-sm">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="bg-white border border-pine/10 rounded p-4">
            <h4 className="font-mono text-[11px] uppercase tracking-wide text-[#8a8776] mb-3">Tags</h4>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Annapurna, Circuit, Gear"
              className="w-full border border-[#D8D3C4] rounded px-3 py-2 text-sm"
            />
            <p className="text-[11px] text-[#8a8776] mt-1.5">Comma-separated — new tags are created automatically.</p>
          </div>

          <div className="bg-white border border-pine/10 rounded p-4">
            <h4 className="font-mono text-[11px] uppercase tracking-wide text-[#8a8776] mb-3">Publish Settings</h4>
            <label className="block text-xs font-medium mb-1.5">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-[#D8D3C4] rounded px-3 py-2 text-sm mb-3">
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
            {status === "scheduled" && (
              <>
                <label className="block text-xs font-medium mb-1.5">Publish date</label>
                <input type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} className="w-full border border-[#D8D3C4] rounded px-3 py-2 text-sm" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolBtn({ onClick, active, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-9 h-9 flex items-center justify-center rounded text-sm ${active ? "bg-pine text-white" : "hover:bg-[#EDE8DA]"}`}
    >
      {children}
    </button>
  );
}
