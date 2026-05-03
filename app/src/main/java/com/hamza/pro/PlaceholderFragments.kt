package com.hamza.pro

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import com.hamza.pro.R

open class BasePlaceholderFragment(private val title: String) : Fragment() {
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        val view = inflater.inflate(R.layout.fragment_placeholder, container, false)
        view.findViewById<TextView>(R.id.placeholder_text).text = title
        return view
    }
}

class LibraryFragment : BasePlaceholderFragment("Library")
class DownloadsFragment : BasePlaceholderFragment("Downloads")
class SettingsFragment : BasePlaceholderFragment("Settings")
