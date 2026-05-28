<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { Search, ChevronDown, HelpCircle, MessageSquare } from 'lucide-vue-next'
import { gsap } from 'gsap'

// Loading state
const isLoading = ref(true)

// State for search query and selected category
const searchQuery = ref('')
const selectedCategory = ref('Hackathon')

// Pagination state
const currentPage = ref(1)
const itemsPerPage = 7

// Accordion open state (contains GLOBAL indices of open FAQs)
// FIX Bug 3: Store global filteredFaqs indices, not paginated indices
const openIndices = ref<number[]>([])

// FAQ categories (Exactly the 4 requested competition tracks)
const categories = [
  'Hackathon',
  'Essay Competition',
  'Creative Web Competition',
  'SDGS Visual Campaign Competition'
]

// FAQ Data mapped strictly to the 4 categories
const faqs = [
  // Hackathon FAQs
  {
    category: 'Hackathon',
    question: 'Apakah satu orang boleh mengikuti lebih dari satu tim?',
    answer: 'Tidak diperbolehkan. Setiap peserta hanya dapat terdaftar pada satu tim dalam satu cabang lomba yang sama. Pendaftaran ganda pada tim yang berbeda dalam cabang yang sama akan mengakibatkan diskualifikasi seluruh tim yang bersangkutan.'
  },
  {
    category: 'Hackathon',
    question: 'Apakah tim atau peserta dapat mengikuti lebih dari satu cabang lomba BYTESFEST 2026 sekaligus?',
    answer: 'Tidak diperbolehkan. Setiap peserta hanya dapat berpartisipasi pada satu cabang lomba dalam BYTESFEST 2026. Ketentuan ini berlaku bagi peserta secara perorangan maupun sebagai bagian dari tim. Peserta yang terdeteksi terdaftar pada lebih dari satu cabang lomba berisiko didiskualifikasi dari seluruh cabang yang diikuti.'
  },
  {
    category: 'Hackathon',
    question: 'Apakah anggota tim boleh berasal dari instansi yang berbeda?',
    answer: 'Diperbolehkan. Tim tidak diwajibkan beranggotakan peserta dari instansi yang sama maupun jenjang pendidikan yang sederajat. Peserta dari perguruan tinggi atau program studi yang berbeda dapat bergabung dalam satu tim, selama masing-masing anggota memenuhi persyaratan peserta yang telah ditetapkan oleh panitia.'
  },
  {
    category: 'Hackathon',
    question: 'Apakah mahasiswa baru boleh mengikuti lomba ini?',
    answer: 'Diperbolehkan. Mahasiswa baru yang belum memiliki Kartu Tanda Mahasiswa (KTM) tetap dapat mendaftar dengan melampirkan kartu tanda terima penerimaan mahasiswa baru yang sah, baik melalui jalur SNBP, SNBT, maupun Seleksi Mandiri dari perguruan tinggi yang bersangkutan. Dokumen tersebut berlaku sebagai bukti status kemahasiswaan yang valid selama KTM belum diterbitkan.'
  },
  {
    category: 'Hackathon',
    question: 'Apakah peserta gap year SMA/SMK/sederajat boleh mengikuti lomba ini?',
    answer: 'Diperbolehkan, dengan ketentuan masa jeda (gap year) tidak melebihi satu tahun sejak kelulusan. Peserta yang memenuhi ketentuan tersebut dapat mendaftar dengan melampirkan Surat Keterangan Lulus (SKL) atau ijazah terakhir sebagai bukti identitas yang sah. Peserta yang masa jedanya telah melebihi satu tahun atau yang sudah berstatus mahasiswa aktif tidak termasuk dalam kategori ini dan wajib menggunakan dokumen yang sesuai dengan status pendidikan terkini.'
  },
  {
    category: 'Hackathon',
    question: 'Apa saja sub-tema yang tersedia?',
    answer: 'Peserta dapat memilih satu dari empat sub-tema SDGs berikut: 1. Pangan (Zero Hunger); 2. Kesehatan (Good Health and Well-Being); 3. Pendidikan (Quality Education); dan 4. Ekonomi & UMKM Solo Raya (Decent Work and Economic Growth).'
  },
  {
    category: 'Hackathon',
    question: 'Apakah ide yang diajukan harus orisinal?',
    answer: 'Ya. Ide wajib merupakan karya asli peserta dan belum pernah memenangkan kompetisi sejenis sebelumnya.'
  },
  {
    category: 'Hackathon',
    question: 'Apa yang dimaksud dengan sistem Split-Phase?',
    answer: 'Split-Phase adalah sistem perlombaan di mana peserta tidak hanya mengembangkan proyek secara mandiri sebelum babak final, tetapi juga diwajibkan menyelesaikan constraint atau tantangan tambahan pada hari pelaksanaan hackathon.'
  },
  {
    category: 'Hackathon',
    question: 'Apa itu constraint dalam Hackathon Day?',
    answer: 'Constraint adalah tantangan tambahan dari panitia yang wajib diintegrasikan ke dalam solusi peserta. Terdapat dua constraint, yaitu: Constraint teknis-fungsional pada pukul 09.30 WIB; dan Constraint kontekstual pada pukul 13.00 WIB.'
  },
  {
    category: 'Hackathon',
    question: 'Apakah peserta boleh menggunakan framework atau library pihak ketiga?',
    answer: 'Diperbolehkan, selama penggunaannya legal, tidak melanggar hak cipta, dan bukan merupakan hasil outsourcing pihak ketiga.'
  },
  {
    category: 'Hackathon',
    question: 'Apakah peserta wajib menggunakan GitHub?',
    answer: 'Ya. Pada akhir Hackathon Day, setiap tim wajib melakukan push proyek ke repositori GitHub masing-masing sebelum diserahkan kepada panitia.'
  },
  {
    category: 'Hackathon',
    question: 'Apa format proposal yang dikumpulkan?',
    answer: 'Ketentuan proposal adalah sebagai berikut: Format berkas: PDF; Ukuran berkas: maksimal 5 MB; Nama berkas: `BYTESFEST2026_[Nama Tim].pdf`; dan Penulisan menggunakan Bahasa Indonesia yang baik dan benar.'
  },
  {
    category: 'Hackathon',
    question: 'Apa saja isi proposal?',
    answer: 'Proposal minimal memuat: Judul proposal; Identitas tim; Permasalahan yang dipilih; Solusi yang diusulkan; dan Teknologi yang digunakan.'
  },
  {
    category: 'Hackathon',
    question: 'Bagaimana sistem penilaian lomba?',
    answer: 'Penilaian meliputi aspek-aspek berikut: Relevansi dan dampak solusi (25%); Inovasi dan kreativitas (25%); Kualitas dan fungsionalitas produk (20%); Integrasi constraint (15%); dan Pitching dan kemampuan menjawab pertanyaan (15%).'
  },
  {
    category: 'Hackathon',
    question: 'Apakah semua peserta mendapatkan sertifikat?',
    answer: 'Ya. Semua anggota tim yang terdaftar akan mendapatkan sertifikat elektronik.'
  },
  // SDGs Visual Campaign Competition FAQs
  {
    category: 'SDGS Visual Campaign Competition',
    question: 'Apakah lomba ini diadakan secara daring?',
    answer: 'Ya, lomba diadakan secara daring. Hanya sesi penghargaan yang dilaksanakan secara luring.'
  },
  {
    category: 'SDGS Visual Campaign Competition',
    question: 'Apakah peserta wajib hadir secara langsung pada sesi penghargaan?',
    answer: 'Peserta diharapkan dapat hadir secara langsung. Apabila peserta tidak dapat hadir, penyerahan penghargaan akan dilakukan secara simbolis dan dana pembinaan akan ditransfer kepada pemenang.'
  },
  {
    category: 'SDGS Visual Campaign Competition',
    question: 'Saya adalah peserta gap year atau lulusan baru dan kartu pelajar saya sudah tidak aktif. Dokumen apa yang harus diunggah pada kolom identitas?',
    answer: 'Peserta gap year atau lulusan baru SMA/SMK/sederajat yang belum memiliki Kartu Tanda Mahasiswa (KTM) dapat mengunggah Surat Keterangan Lulus (SKL) atau kartu pelajar terakhir sebagai bukti identitas yang sah.'
  },
  {
    category: 'SDGS Visual Campaign Competition',
    question: 'Bagaimana cara mendapatkan Kode Peserta untuk penamaan berkas atau folder?',
    answer: 'Kode Peserta akan diperoleh setelah peserta menyelesaikan pendaftaran melalui Google Form dan melakukan konfirmasi pembayaran. Kode tersebut akan dikirimkan oleh panitia melalui WhatsApp setelah data pendaftaran dinyatakan valid.'
  },
  {
    category: 'SDGS Visual Campaign Competition',
    question: 'Apakah video rekam layar (screen recording) harus dipercepat (time-lapse)?',
    answer: 'Ya. Mengingat batas durasi video yang ditetapkan adalah 1–3 menit, peserta disarankan untuk menyunting video proses berkarya menjadi time-lapse. Video tersebut harus menampilkan proses yang jelas dari kanvas kosong hingga karya poster selesai.'
  },
  {
    category: 'SDGS Visual Campaign Competition',
    question: 'Apakah boleh menggunakan akun Instagram kedua untuk mengunggah twibbon dan membagikan pamflet?',
    answer: 'Peserta diwajibkan menggunakan akun Instagram utama yang aktif. Selain itu, akun Instagram peserta tidak boleh dalam mode terkunci (private) selama periode lomba berlangsung. Hal ini diperlukan agar panitia dapat memverifikasi unggahan twibbon dan penandaan instastory secara akurat.'
  },
  {
    category: 'SDGS Visual Campaign Competition',
    question: 'Apa perbedaan antara poster publik/ilustrasi dan infografis yang disebutkan dalam ketentuan teknis?',
    answer: 'Poster ilustrasi atau poster publik lebih mengutamakan kekuatan visual dan slogan kampanye yang persuasif untuk menggugah emosi pembaca. Apabila karya didominasi oleh bagan, grafik, diagram, atau teks penjelasan yang terlalu padat, karya tersebut akan dikategorikan sebagai infografis dan berisiko terdiskualifikasi.'
  },
  {
    category: 'SDGS Visual Campaign Competition',
    question: 'Untuk pemilihan Juara Favorit, apakah semua karya peserta akan diunggah di Instagram @bytesfest?',
    answer: 'Ya. Karena Juara Favorit ditentukan berdasarkan jumlah like terbanyak di akun Instagram @bytesfest, seluruh karya peserta akan diunggah pada akun tersebut.'
  },
  // Creative Web Competition FAQs
  {
    category: 'Creative Web Competition',
    question: 'Apakah boleh menggunakan AI untuk membantu pembuatan desain dan kode?',
    answer: 'Diperbolehkan. Namun, penggunaan AI hanya diizinkan sebagai alat bantu untuk mencari referensi, inspirasi, atau informasi. Proses pengembangan ide, konsep, desain, maupun penulisan kode tetap diutamakan dari kreativitas dan kemampuan peserta sendiri.'
  },
  {
    category: 'Creative Web Competition',
    question: 'Apakah website wajib responsif?',
    answer: 'Ya, website wajib responsif. Responsive design menjadi salah satu aspek penilaian dengan bobot 15%, sehingga tampilan website pada berbagai perangkat, seperti laptop maupun telepon pintar, akan menjadi perhatian juri.'
  },
  {
    category: 'Creative Web Competition',
    question: 'Apakah boleh merevisi karya yang sudah dikumpulkan sebelum tenggat waktu, atau memperbaiki kesalahan setelah deadline?',
    answer: 'Selama masih sebelum tenggat waktu, peserta masih dapat melakukan revisi atau perbaikan terhadap karya yang telah dikumpulkan. Setelah tenggat waktu berakhir, karya tidak dapat dimodifikasi lagi.'
  },
  {
    category: 'Creative Web Competition',
    question: 'Apakah boleh mengunggah karya lomba ke portofolio pribadi?',
    answer: 'Diperbolehkan, selama memenuhi ketentuan lomba, yaitu karya harus orisinal dan belum pernah diikutsertakan dalam perlombaan lain.'
  },
  {
    category: 'Creative Web Competition',
    question: 'Bagaimana status hak cipta desain setelah karya dikumpulkan?',
    answer: 'Hak cipta karya tetap menjadi milik peserta. Namun, panitia memiliki hak untuk mempublikasikan karya website yang telah dikumpulkan.'
  },
  {
    category: 'Creative Web Competition',
    question: 'Apakah boleh mengganti anggota tim setelah karya resmi dikumpulkan?',
    answer: 'Tidak diperbolehkan. Sesuai ketentuan panduan (guidebook), peserta yang sudah terdaftar tidak dapat digantikan oleh pihak lain dengan alasan apa pun.'
  },
  {
    category: 'Creative Web Competition',
    question: 'Apakah biaya pendaftaran dapat dikembalikan jika peserta membatalkan keikutsertaan?',
    answer: 'Apabila peserta membatalkan keikutsertaan, biaya pendaftaran tidak dapat dikembalikan (non-refundable). Ketentuan ini juga berlaku apabila peserta tidak mengumpulkan karya hingga batas waktu yang ditentukan.'
  },
  // Essay Competition FAQs
  {
    category: 'Essay Competition',
    question: 'Siapa yang boleh mengikuti lomba esai ini?',
    answer: 'Peserta adalah mahasiswa D3/D4/S1 yang berstatus aktif dari seluruh perguruan tinggi di Indonesia.'
  },
  {
    category: 'Essay Competition',
    question: 'Apakah lomba ini bersifat individu atau tim?',
    answer: 'Essay competition diikuti secara berkelompok dengan jumlah anggota 2–3 orang per tim.'
  },
  {
    category: 'Essay Competition',
    question: 'Apakah anggota tim boleh berasal dari perguruan tinggi yang berbeda?',
    answer: 'Sangat diperbolehkan.'
  },
  {
    category: 'Essay Competition',
    question: 'Berapa panjang esai yang harus ditulis?',
    answer: 'Isi esai ditulis minimal 5 halaman dan maksimal 8 halaman, di luar halaman sampul, daftar pustaka, dan biodata singkat.'
  },
  {
    category: 'Essay Competition',
    question: 'Apa saja ketentuan format penulisan?',
    answer: 'Ketentuan format penulisan adalah sebagai berikut: Jenis huruf: Times New Roman, ukuran 12; Spasi: 1,5; Ukuran kertas: A4; Margin: kiri 4 cm, kanan 3 cm, atas 3 cm, bawah 3 cm; dan Perataan teks: rata kanan-kiri (justified).'
  },
  {
    category: 'Essay Competition',
    question: 'Berapa batas maksimal toleransi plagiarisme berdasarkan Turnitin?',
    answer: 'Batas maksimal similarity index adalah 25%. Karya yang melebihi batas tersebut akan otomatis didiskualifikasi.'
  },
  {
    category: 'Essay Competition',
    question: 'Apakah akan ada babak presentasi bagi tim yang lolos? Apakah presentasi dilakukan secara luring?',
    answer: 'Ya. Sebanyak 5 tim dengan nilai esai tertinggi akan maju ke babak final untuk mempresentasikan karyanya di hadapan juri secara daring.'
  },
  {
    category: 'Essay Competition',
    question: 'Kapan pemenang lomba akan diumumkan? Apakah peserta wajib menghadiri acara penghargaan?',
    answer: 'Setelah 5 finalis mengikuti sesi penjurian, pemenang lomba akan diumumkan pada tanggal 21 Juli 2026. Peserta yang memenangkan essay competition diharapkan dapat hadir secara langsung pada acara Grand Closing Bytesfest 2026.'
  },
  {
    category: 'Essay Competition',
    question: 'Apakah sertifikat diberikan per tim atau per individu?',
    answer: 'Sertifikat diberikan per individu.'
  }
]

// Filtered FAQs based on search and selected category
const filteredFaqs = computed(() => {
  return faqs.filter(faq => {
    const matchesCategory = faq.category === selectedCategory.value
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

// Paginated FAQs — returns items with their GLOBAL filteredFaqs index attached
// FIX Bug 3: carry globalIndex so accordion state is keyed to filteredFaqs position, not page position
const paginatedFaqs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredFaqs.value.slice(start, end).map((faq, i) => ({
    ...faq,
    globalIndex: start + i
  }))
})

// Total pages
const totalPages = computed(() => Math.ceil(filteredFaqs.value.length / itemsPerPage))

// Set category filter
const selectCategory = (category: string) => {
  selectedCategory.value = category
  openIndices.value = [] // Reset all accordions on category switch
  currentPage.value = 1  // Reset to page 1 on category switch
}

// Watch for search changes to reset pagination and close all accordions
watch(searchQuery, () => {
  currentPage.value = 1
  openIndices.value = []
})

// Watch for page changes to smooth scroll
watch(currentPage, () => {
  const faqList = document.querySelector('.faq-list')
  if (faqList) {
    faqList.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
})

// Toggle individual accordion by GLOBAL index
// FIX Bug 3: uses globalIndex from paginatedFaqs, not local loop index
const toggleFaq = (globalIndex: number) => {
  const position = openIndices.value.indexOf(globalIndex)
  if (position === -1) {
    openIndices.value.push(globalIndex)
  } else {
    openIndices.value.splice(position, 1)
  }
}

// Check if a FAQ is open by GLOBAL index
const isOpen = (globalIndex: number) => {
  return openIndices.value.includes(globalIndex)
}

// Animate FAQ items sliding up
const animateFAQItems = (delay = 0) => {
  gsap.fromTo('.faq-item', 
    { opacity: 0.25, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      delay: delay,
      stagger: 0.1,
      ease: 'power3.out'
    }
  )
}

onMounted(() => {
  setTimeout(async () => {
    isLoading.value = false
    await nextTick()
    
    // Animate header elements simultaneously
    gsap.from('.faq-header-badge', {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: 'power3.out'
    })
    
    gsap.from('.faq-header-title', {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power3.out'
    })
    
    gsap.from('.faq-header-desc', {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power3.out'
    })
    
    gsap.from('.faq-header-search', {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power3.out'
    })
    
    gsap.to('.faq-category-chip', {
      opacity: 1,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power3.out',
      clearProps: 'transform'
    })
    
    // Animate FAQ items simultaneously
    animateFAQItems(0)
  }, 600)
})
</script>

<template>
  <div class="pt-28 font-sans min-h-screen relative overflow-hidden">
    <!-- Ambient Blobs -->
    <div class="absolute -z-10 top-[10%] right-[-10%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-brand-blue-light/26 blur-[100px] sm:blur-[130px] pointer-events-none orb-color-cycle"></div>
    <div class="absolute -z-10 bottom-[15%] left-[-10%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-brand-teal-light/26 blur-[100px] sm:blur-[130px] pointer-events-none orb-color-cycle"></div>

    <!-- Header Section -->
    <section v-if="!isLoading" class="max-w-4xl mx-auto px-6 py-12 text-center flex flex-col items-center gap-6">
      <div class="faq-header-badge inline-flex items-center gap-2 px-4 py-2 bg-brand-pale-teal/30 border border-brand-teal/20 rounded-full text-brand-teal text-xs font-bold tracking-wider uppercase">
        <MessageSquare class="w-3.5 h-3.5" />
        FAQ
      </div>
      
      <h1 class="faq-header-title font-rexlia text-3xl sm:text-4xl md:text-5xl tracking-wider uppercase leading-tight">
        <span class="bg-gradient-to-r from-brand-blue via-brand-blue-light to-brand-teal bg-clip-text text-transparent">Ada Pertanyaan?</span>
      </h1>
      
      <p class="faq-header-desc text-brand-grey text-base md:text-lg max-w-xl leading-relaxed">
        Temukan jawaban cepat atas pertanyaan umum seputar pelaksanaan pendaftaran, kriteria, dan detail kompetisi BYTESFEST 2026.
      </p>

      <!-- Search Input -->
      <div class="faq-header-search w-full max-w-xl relative mt-4">
        <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-brand-grey/60">
          <Search class="w-5 h-5" />
        </span>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari pertanyaan atau jawaban..." 
          class="w-full pl-12 pr-6 py-3.5 rounded-full border border-brand-blue/15 bg-white text-brand-navy placeholder:text-brand-grey/50 shadow-sm focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all duration-300 text-sm md:text-base"
        />
      </div>
    </section>

    <!-- Filters & Content -->
    <section v-if="!isLoading" class="max-w-4xl mx-auto px-6 pb-24 flex flex-col gap-10">
      
      <!-- Category Chips -->
      <div class="flex flex-wrap items-center justify-center gap-2.5">
        <button 
          v-for="cat in categories" 
          :key="cat"
          @click="selectCategory(cat)"
          class="faq-category-chip faq-chip-init px-5 py-2.5 rounded-full text-xs font-rexlia tracking-wider border transition-all duration-300 cursor-pointer"
          :class="selectedCategory === cat 
            ? 'bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20' 
            : 'bg-white text-brand-navy border-brand-blue/10 hover:border-brand-blue/30 hover:bg-brand-pale-teal/10'"
        >
          {{ cat }}
        </button>
      </div>

      <!-- FAQ List -->
      <div class="flex flex-col gap-4">
        <div v-if="filteredFaqs.length === 0" class="text-center py-16 border border-dashed border-brand-blue/20 rounded-3xl bg-white p-8">
          <HelpCircle class="w-12 h-12 text-brand-blue/30 mx-auto mb-3" />
          <p class="font-rexlia text-base text-brand-navy font-bold tracking-wide">Pertanyaan tidak ditemukan</p>
          <p class="text-brand-grey text-sm mt-1">Coba gunakan kata kunci pencarian atau kategori filter lainnya.</p>
        </div>

        <!--
          FIX Bug 3: iterate paginatedFaqs which now carries globalIndex.
          toggleFaq and isOpen both receive globalIndex instead of the local loop index,
          so accordion state is stable across page changes.
        -->
        <div 
          v-for="faq in paginatedFaqs" 
          :key="faq.globalIndex"
          class="faq-item border border-brand-blue/10 bg-white rounded-2xl hover:border-brand-blue/25 transition-all duration-300 shadow-sm"
        >
          <!-- Accordion Header -->
          <button 
            @click="toggleFaq(faq.globalIndex)" 
            class="w-full px-6 py-5 flex items-center justify-between text-left gap-4 font-rexlia text-sm md:text-base text-brand-navy font-bold tracking-wide hover:text-brand-blue transition-colors duration-200 cursor-pointer"
          >
            <span>{{ faq.question }}</span>
            <ChevronDown 
              class="w-5 h-5 shrink-0 text-brand-grey transition-transform duration-300"
              :class="{ 'rotate-180 text-brand-blue': isOpen(faq.globalIndex) }"
            />
          </button>

          <!--
            FIX Bug 4: The transition hooks set overflow:hidden during animation
            so content doesn't bleed outside the collapsing container.
            enter-from / leave-to opacity added for a smoother fade+slide feel.
          -->
          <transition 
            name="faq-slide"
            @before-enter="(el) => { (el as HTMLElement).style.height = '0px'; (el as HTMLElement).style.overflow = 'hidden' }"
            @enter="(el) => { (el as HTMLElement).style.height = (el as HTMLElement).scrollHeight + 'px' }"
            @after-enter="(el) => { (el as HTMLElement).style.height = ''; (el as HTMLElement).style.overflow = '' }"
            @before-leave="(el) => { (el as HTMLElement).style.height = (el as HTMLElement).scrollHeight + 'px'; (el as HTMLElement).style.overflow = 'hidden' }"
            @leave="(el) => { (el as HTMLElement).style.height = '0px' }"
            @after-leave="(el) => { (el as HTMLElement).style.height = ''; (el as HTMLElement).style.overflow = '' }"
          >
            <div 
              v-show="isOpen(faq.globalIndex)" 
              class="border-t border-brand-blue/5"
            >
              <div class="px-6 py-5 text-brand-grey text-xs md:text-sm leading-relaxed text-justify bg-brand-pale-teal/5">
                {{ faq.answer }}
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
        <button 
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-4 py-2 rounded-full border border-brand-blue/10 bg-white text-brand-navy hover:bg-brand-blue/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Prev
        </button>
        <button 
          v-for="page in totalPages" 
          :key="page"
          @click="currentPage = page"
          :class="currentPage === page 
            ? 'bg-brand-blue text-white border-brand-blue' 
            : 'bg-white text-brand-navy border-brand-blue/10 hover:bg-brand-blue/5'"
          class="w-10 h-10 rounded-full border font-rexlia text-sm transition-all duration-300"
        >
          {{ page }}
        </button>
        <button 
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 rounded-full border border-brand-blue/10 bg-white text-brand-navy hover:bg-brand-blue/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Next
        </button>
      </div>
    </section>

    <!-- Skeleton Loading -->
    <template v-if="isLoading">
      <!-- Skeleton Header -->
      <section class="max-w-4xl mx-auto px-6 py-12 text-center flex flex-col items-center gap-6">
        <div class="skeleton h-10 w-32 rounded-full"></div>
        <div class="skeleton h-14 w-3/4 rounded-lg"></div>
        <div class="skeleton h-4 w-full rounded mb-2"></div>
        <div class="skeleton h-4 w-2/3 rounded"></div>
        <div class="w-full max-w-xl relative mt-4">
          <div class="skeleton h-14 w-full rounded-full"></div>
        </div>
      </section>

      <!-- Skeleton Filters & FAQ List -->
      <section class="max-w-4xl mx-auto px-6 pb-24 flex flex-col gap-10">
        <div class="flex flex-wrap items-center justify-center gap-2.5">
          <div class="skeleton h-10 w-32 rounded-full" v-for="i in 4" :key="i"></div>
        </div>
        <div class="flex flex-col gap-4">
          <div 
            v-for="i in 5" 
            :key="i"
            class="p-6 rounded-2xl border border-brand-blue/10 bg-white"
          >
            <div class="skeleton h-5 w-3/4 rounded mb-3"></div>
            <div class="skeleton h-4 w-full rounded"></div>
            <div class="skeleton h-4 w-5/6 rounded mt-2"></div>
          </div>
        </div>
        <div class="flex items-center justify-center gap-2 mt-8">
          <div class="skeleton h-10 w-16 rounded-full"></div>
          <div class="skeleton h-10 w-10 rounded-full" v-for="i in 3" :key="i"></div>
          <div class="skeleton h-10 w-16 rounded-full"></div>
        </div>
      </section>
    </template>

  </div>
</template>

<style scoped>
/* 
  faq-slide transition uses height-based JS hooks (in @before-enter etc.)
  The CSS transition class just needs to declare the timing function.
  overflow:hidden is handled in the JS hooks to prevent content bleed.
*/
.faq-slide-enter-active,
.faq-slide-leave-active {
  transition: height 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
              opacity 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Chips start at 25% opacity — GSAP will animate from here */
.faq-chip-init {
  opacity: 0.25;
}

.faq-slide-enter-from,
.faq-slide-leave-to {
  opacity: 0;
}

/* Skeleton Animation */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Color Cycle Animation for Orbs */
.orb-color-cycle {
  animation: colorCycle 8s ease-in-out infinite;
}

@keyframes colorCycle {
  0%, 100% {
    background-color: rgba(30, 136, 229, 0.26); /* Blue */
  }
  25% {
    background-color: rgba(0, 150, 136, 0.26); /* Green */
  }
  50% {
    background-color: rgba(0, 168, 204, 0.26); /* Bluish Green */
  }
  75% {
    background-color: rgba(147, 51, 234, 0.26); /* Purple */
  }
}
</style>