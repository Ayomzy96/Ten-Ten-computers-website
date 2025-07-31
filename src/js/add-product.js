import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);
console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("Supabase Key:", import.meta.env.VITE_SUPABASE_KEY);


// Handle form submission
document.getElementById('add-product-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const alertMessage = document.getElementById('alert-message');
  alertMessage.classList.remove('show', 'alert-success', 'alert-danger');
  alertMessage.textContent = '';

  // Get form values
  const model = document.getElementById('model').value.trim();
  const specifications = document.getElementById('specifications').value.trim();
  const price = parseFloat(document.getElementById('price').value);
  const imageUrlsInput = document.getElementById('image-urls').value.trim();
  const phoneNumber = document.getElementById('phone-number').value.trim();
  let whatsappNumber = document.getElementById('whatsapp-number').value.trim();

  // Strip any leading '+' from whatsapp_number
  whatsappNumber = whatsappNumber.replace(/^\+/, '');

  // Validate inputs
  if (!model || !specifications || isNaN(price) || price < 0) {
    showAlert('Please fill in all required fields correctly.', 'danger');
    return;
  }

  if (!isValidPhone(phoneNumber)) {
    showAlert('Invalid phone number format. Use + followed by 10-15 digits (e.g., +1234567890).', 'danger');
    return;
  }

  if (!isValidWhatsAppNumber(whatsappNumber)) {
    showAlert('Invalid WhatsApp number format. Use 10-15 digits without + (e.g., 1234567890).', 'danger');
    return;
  }

  // Parse and validate image URLs, cleaning up extra slashes
  const imageUrls = imageUrlsInput
    ? imageUrlsInput
        .split(',')
        .map(url => url.trim().replace(/\/+/g, '/'))
        .map(url => {
          if (url.includes('supabase.co/storage/v1/object/public')) {
            return url.replace(/(\/public\/)/, '/public/');
          }
          return url;
        })
        .filter(isValidUrl)
    : [];
  if (imageUrls.length === 0) {
    showAlert('Please provide at least one valid image URL.', 'danger');
    return;
  }

  // Insert product into Supabase
  try {
    const { error } = await supabase
      .from('laptops')
      .insert({
        model,
        specifications,
        price,
        image_urls: imageUrls,
        phone_number: phoneNumber,
        whatsapp_number: whatsappNumber,
        is_in_stock: document.getElementById('is-in-stock').checked
      });

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === '42501') {
        throw new Error('Unauthorized: Check RLS policies on the laptops table. Public inserts may not be allowed.');
      } else if (error.code === '23514') {
        throw new Error('Invalid WhatsApp number format in database. Ensure it contains only 10-15 digits with no + or other characters.');
      }
      throw new Error(`Supabase error: ${error.message} (Code: ${error.code})`);
    }

    showAlert('Product added successfully!', 'success');
    document.getElementById('add-product-form').reset();
    document.getElementById('is-in-stock').checked = true;
  } catch (error) {
    console.error('Error adding product:', error);
    showAlert(`Failed to add product: ${error.message}`, 'danger');
  }
});

// Helper function to validate URLs
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Helper function to validate phone numbers
function isValidPhone(phone) {
  return /^\+?\d{10,15}$/.test(phone);
}

// Helper function to validate WhatsApp numbers
function isValidWhatsAppNumber(phone) {
  return /^\d{10,15}$/.test(phone);
}

// Show alert message
function showAlert(message, type) {
  const alertMessage = document.getElementById('alert-message');
  alertMessage.textContent = message;
  alertMessage.classList.add('show', `alert-${type}`);
}