package com.hamza.pro

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.EditorInfo
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import coil.load
import com.hamza.pro.databinding.FragmentHomeBinding
import com.hamza.pro.databinding.ItemSearchResultBinding

data class SearchResult(
    val id: String,
    val title: String,
    val author: String,
    val thumbnail: String
)

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.recyclerSearch.layoutManager = LinearLayoutManager(context)
        
        binding.editSearch.setOnEditorActionListener { _, actionId, _ ->
            if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                performSearch(binding.editSearch.text.toString())
                true
            } else false
        }

        binding.btnSearch.setOnClickListener {
            performSearch(binding.editSearch.text.toString())
        }
    }

    private fun performSearch(query: String) {
        if (query.isBlank()) return
        
        // Mock results matching the React app
        val mockResults = listOf(
            SearchResult("1", "Hamza - Life is Music", "Artist", "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400"),
            SearchResult("2", "Midnight City Beats", "Lofi King", "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400"),
            SearchResult("3", "Infinite Arabic Oud", "Heritage", "https://images.unsplash.com/photo-1514525253361-b83f85f5e43a?w=400")
        )

        binding.txtResultsHeader.visibility = View.VISIBLE
        binding.emptyState.visibility = View.GONE
        binding.recyclerSearch.adapter = SearchAdapter(mockResults)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    class SearchAdapter(private val results: List<SearchResult>) :
        RecyclerView.Adapter<SearchAdapter.ViewHolder>() {

        class ViewHolder(val binding: ItemSearchResultBinding) : RecyclerView.ViewHolder(binding.root)

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
            val binding = ItemSearchResultBinding.inflate(LayoutInflater.from(parent.context), parent, false)
            return ViewHolder(binding)
        }

        override fun onBindViewHolder(holder: ViewHolder, position: Int) {
            val item = results[position]
            holder.binding.txtTitle.text = item.title
            holder.binding.txtAuthor.text = item.author
            holder.binding.imgThumbnail.load(item.thumbnail)
        }

        override fun getItemCount() = results.size
    }
}
