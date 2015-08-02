<?php
	$userGroup = <<<__QUERY
	CREATE TABLE IF NOT EXISTS `userGroup` (
  		`name` varchar(255) NOT NULL,
  		`ID` int(11) NOT NULL AUTO_INCREMENT,
  		`password` int(30) NOT NULL,
  		PRIMARY KEY (`ID`)
	) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

__QUERY;
	$place = <<<__QUERY
	CREATE TABLE IF NOT EXISTS `place` (
		`name` varchar(255) NOT NULL,
		`ID` int(11) NOT NULL AUTO_INCREMENT,
		`address` text NOT NULL,
		`group_key` int(11) NOT NULL,
		`subGroup` int(11) DEFAULT NULL,
		`position` int(11) DEFAULT NULL,
		PRIMARY KEY (`ID`)
	) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
__QUERY;
	$user = <<<__QUERY
	CREATE TABLE IF NOT EXISTS `user` (
		`firstName` varchar(35) NOT NULL,
		`lastName` varchar(35) NOT NULL,
		`ID` int(11) NOT NULL AUTO_INCREMENT,
		`groupKey` int(11) NOT NULL,
		`subGroup` int(11) DEFAULT NULL,
		`password` varchar(30) NOT NULL,
		`username` varchar(35) NOT NULL,
		`email` varchar(255) NOT NULL,
		PRIMARY KEY (`ID`)
	) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

__QUERY;

?>