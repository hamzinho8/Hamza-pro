package com.hamza.pro

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.EditorInfo
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import coil.load
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import com.hamza.pro.databinding.FragmentHomeBinding
import com.hamza.pro.databinding.ItemSearchResultBinding
import com.hamza.pro.R

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

        binding.recyclerSearch.layoutManager = LinearLayoutManager(requireContext())
        
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
        
        binding.progressSearch.visibility = View.VISIBLE
        binding.emptyState.visibility = View.GONE
        binding.recyclerSearch.visibility = View.GONE

        viewLifecycleOwner.lifecycleScope.launch {
            delay(1000)
            
            if (_binding == null) return@launch

            binding.progressSearch.visibility = View.GONE
            binding.recyclerSearch.visibility = View.VISIBLE
            
            val mockResults = listOf(
                SearchResult("1", "Hamza - Life is Music", "Artist", "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400"),
                SearchResult("2", "Midnight City Beats", "Lofi King", "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400"),
                SearchResult("3", "Infinite Arabic Oud", "Heritage", "https://images.unsplash.com/photo-1514525253361-b83f85f5e43a?w=400"),
                SearchResult("4", "Electric Dreams", "Synth Master", "https://images.unsplash.com/photo-1459749411177-042180ceea72?w=400"),
                SearchResult("5", "Summer Vibes 2024", "DJ Sunshine", "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400")
            )

            binding.txtResultsHeader.visibility = View.VISIBLE
            binding.recyclerSearch.adapter = SearchAdapter(mockResults) { item, action ->
                if (action == "Playing") {
                    (requireActivity() as? MainActivity)?.showPlayer(item.title, item.author, item.thumbnail)
                } else {
                    Toast.makeText(context, "${action}: ${item.title}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

class SearchAdapter(
    private val results: List<SearchResult>,
    private val onAction: (SearchResult, String) -> Unit
) : RecyclerView.Adapter<SearchAdapter.ViewHolder>() {

    class ViewHolder(val itemBinding: ItemSearchResultBinding) : RecyclerView.ViewHolder(itemBinding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val itemBinding = ItemSearchResultBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(itemBinding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = results[position]
        holder.itemBinding.txtTitle.text = item.title
        holder.itemBinding.txtAuthor.text = item.author
        holder.itemBinding.imgThumbnail.load(item.thumbnail)
        
        holder.itemBinding.root.setOnClickListener {
            onAction(item, "Playing")
        }
    }

    override fun getItemCount() = results.size
}
