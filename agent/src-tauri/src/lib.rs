pub mod commands;
pub mod config;
pub mod errors;
pub mod services;
pub mod state;
pub mod system;
pub mod websocket;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::get_sys_info,
            commands::ping_agent
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
