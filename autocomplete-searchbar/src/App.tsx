import AutocompleteSearchbar from './components/AutocompleteSearchbar'
import './App.css'

function App() {
  return (
    <main className="page">
      <header className="page-heading">
        <p className="eyebrow">CLINICAL SEARCH</p>
        <h1>Find a clinical concept</h1>
        <p className="page-description">
          Search biomarkers and clinical events.
        </p>
      </header>

      <section className="search-section" aria-label="Search clinical concepts">
        <h2>Search concepts</h2>
        <AutocompleteSearchbar />
      </section>
    </main>
  )
}

export default App
