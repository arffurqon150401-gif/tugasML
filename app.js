const { createApp, ref } = Vue;

createApp({
  setup() {
    const brand = ref('Ford');
    const transmission = ref('A/T');
    const tahun = ref(2022);
    const milage = ref(5500);
    const hasil = ref(null);
    const isLoading = ref(false);

    // ====================================================================
    // PASTIKAN LINK NGROK DI BAWAH SAMA DENGAN YANG MUNCUL DI GOOGLE COLAB
    // ====================================================================
    const NGROK_URL = "https://refusing-creatable-body.ngrok-free.dev/predict";
    const LOCAL_URL = "http://127.0.0.1:5000/predict";

    const prediksi = async () => {
      if (!tahun.value || !milage.value || !brand.value) {
        alert("Mohon lengkapi Merek, Tahun, dan Milage terlebih dahulu!");
        return;
      }

      isLoading.value = true;
      hasil.value = null;

      const payload = {
        brand: brand.value,
        transmission: transmission.value,
        tahun: Number(tahun.value),
        milage: Number(milage.value)
      };

      try {
        // Coba hubungi server Google Colab (Ngrok) terlebih dahulu
        let response;
        try {
          response = await fetch(NGROK_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify(payload)
          });
        } catch (ngrokErr) {
          // Jika Colab mati, otomatis beralih ke server lokal (app.py) jika sedang dijalankan
          response = await fetch(LOCAL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }

        const data = await response.json();

        if (data.status === 'success') {
          hasil.value = data.harga !== undefined ? data.harga : data.predicted_price;
        } else {
          alert("Error dari server: " + data.message);
        }
      } catch (error) {
        alert("Gagal menghubungi server! Pastikan Cell di Google Colab masih menyala dan link Ngrok di app.js sudah sesuai.");
        console.error("Detail Error:", error);
      } finally {
        isLoading.value = false;
      }
    };

    const formatRupiah = (angka) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(angka);
    };

    return {
      brand,
      transmission,
      tahun,
      milage,
      hasil,
      isLoading,
      prediksi,
      formatRupiah
    };
  }
}).mount('#app');