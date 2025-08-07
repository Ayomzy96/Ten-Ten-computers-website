import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Supabase client with error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
let supabase;

try {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  const toast = new bootstrap.Toast(document.getElementById('errorToast'));
  toast.show();
}

// Upload laptop function
async function uploadLaptop(event) {
  event.preventDefault();
  console.log('Upload button clicked');

  const form = event.target;
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true; // Disable button to prevent multiple submissions

  // Get form inputs
  const model = form.model.value;
  const specifications = form.specifications.value;
  const price = parseFloat(form.price.value);
  const isInStock = form.is_in_stock.checked;
  const phoneNumber = form.phone_number.value;
  const whatsappNumber = form.whatsapp_number.value;
  const imageFiles = form.image_files.files;

  console.log('Form data:', { model, specifications, price, isInStock, phoneNumber, whatsappNumber, imageFiles: imageFiles.length });

  if (!supabase) {
    console.error('Supabase client is not initialized');
    const toast = new bootstrap.Toast(document.getElementById('errorToast'));
    toast.show();
    submitButton.disabled = false;
    return;
  }

  try {
    // Upload images to Supabase Storage
    const imageUrls = [];
    const bucketName = 'product-images';

    for (const file of imageFiles) {
      const fileName = `${Date.now()}_${file.name}`;
      console.log('Uploading image:', fileName);

      // Upload image to the public folder with timeout
      const uploadPromise = supabase.storage
        .from(bucketName)
        .upload(`public/${fileName}`, file);

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Image upload timed out')), 10000);
      });

      const { data: uploadData, error: uploadError } = await Promise.race([uploadPromise, timeoutPromise]);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      // Generate the public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(`public/${fileName}`);

      if (!urlData?.publicUrl) {
        throw new Error('Failed to generate public URL for image');
      }

      // Ensure correct URL format
      const correctUrl = urlData.publicUrl.replace('https:/', 'https://');
      console.log('Generated URL:', correctUrl);
      imageUrls.push(correctUrl);
    }

    // Insert laptop data into the table
    console.log('Inserting laptop data:', { model, specifications, price, is_in_stock: isInStock, phone_number: phoneNumber, whatsapp_number: whatsappNumber, image_urls: imageUrls });
    const { data, error } = await supabase
      .from('laptops')
      .insert({
        model,
        specifications,
        price,
        is_in_stock: isInStock,
        phone_number: phoneNumber,
        whatsapp_number: whatsappNumber,
        image_urls: imageUrls,
      });

    if (error) {
      console.error('Error inserting laptop:', error);
      throw new Error(`Failed to save laptop: ${error.message}`);
    }

    // Show success toast
    const toast = new bootstrap.Toast(document.getElementById('successToast'));
    toast.show();
    form.reset();
    // Redirect to catalogue after toast
    setTimeout(() => {
      window.location.href = './catalogue.html';
    }, 3000);
  } catch (error) {
    console.error('Error uploading laptop:', error);
    const toast = new bootstrap.Toast(document.getElementById('errorToast'));
    toast.show();
  } finally {
    submitButton.disabled = false; // Re-enable button
  }
}

// Attach to form submission
const form = document.getElementById('upload-form');
if (form) {
  console.log('Form found, attaching event listener');
  form.addEventListener('submit', uploadLaptop);
} else {
  console.error('Form with ID "upload-form" not found');
}