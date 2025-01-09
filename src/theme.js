function toggle_theme(event)
{
  document.getElementsByTagName("body")[0]
    .classList
    .toggle("light_theme");

  event.stopPropagation();
}
