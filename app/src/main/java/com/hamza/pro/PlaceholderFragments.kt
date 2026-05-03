package com.hamza.pro

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import com.hamza.pro.R
import android.widget.RadioGroup

abstract class BasePlaceholderFragment(private val title: String) : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_placeholder, container, false)
        view.findViewById<TextView>(R.id.placeholder_text).text = title
        return view
    }
}

class LibraryFragment : Fragment() {
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        val view = inflater.inflate(R.layout.fragment_placeholder, container, false)
        view.findViewById<TextView>(R.id.placeholder_text).text = "My Library\n(You have no tracks saved yet)"
        return view
    }
}

class DownloadsFragment : Fragment() {
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        val view = inflater.inflate(R.layout.fragment_placeholder, container, false)
        view.findViewById<TextView>(R.id.placeholder_text).text = "Downloads\n(Offline tracks appear here)"
        return view
    }
}

class SettingsFragment : Fragment() {
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        val view = inflater.inflate(R.layout.fragment_settings, container, false)
        
        val prefs = requireContext().getSharedPreferences("theme_prefs", Context.MODE_PRIVATE)
        val currentTheme = prefs.getString("theme", "default")
        
        val group = view.findViewById<RadioGroup>(R.id.theme_group)
        when (currentTheme) {
            "default" -> group.check(R.id.theme_default)
            "blue" -> group.check(R.id.theme_blue)
            "red" -> group.check(R.id.theme_red)
            "green" -> group.check(R.id.theme_green)
        }
        
        group.post {
            group.setOnCheckedChangeListener { _, checkedId ->
                val theme = when (checkedId) {
                    R.id.theme_default -> "default"
                    R.id.theme_blue -> "blue"
                    R.id.theme_red -> "red"
                    R.id.theme_green -> "green"
                    else -> "default"
                }
                if (theme != currentTheme) {
                    prefs.edit().putString("theme", theme).apply()
                    requireActivity().recreate()
                }
            }
        }
        
        return view
    }
}
