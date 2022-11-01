export enum routes {
	Home = '/',
}

export enum keywords {
	projectName = 'Task',
	studioName = 'Sanzhar Abdurahmanov',
	frontendUrl = 'http://localhost:3000',
	backendUrl = 'http://localhost:5000',
}

export enum Sizes {
	HeaderMobileHeight = 56,
	HeaderDesktopHeight = 56,
	MenuMobileHeight = 56,
	SideMenuWidth = 0,
	AppMinWidth = 320,
	ContainerPaddingX = 24,
	SideMenuMaxWidth = Sizes.AppMinWidth - (Sizes.ContainerPaddingX * 2),
	MenuMobileMaxWidth = Sizes.AppMinWidth - (Sizes.ContainerPaddingX * 2),
	ContainerMinWidth = Sizes.AppMinWidth - Sizes.SideMenuWidth,
	InnerMinWidth = (Sizes.AppMinWidth - Sizes.SideMenuWidth) - (Sizes.ContainerPaddingX * 2),
}